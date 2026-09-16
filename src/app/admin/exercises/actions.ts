'use server'

import { AwsClient } from 'aws4fetch'

export async function getPresignedUrl(fileName: string, fileType: string) {
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials are not configured in production environment variables.')
  }

  // Parse endpoint and bucket name from the S3_API URL provided in .env
  const s3Url = new URL(process.env.S3_API!)
  const endpoint = s3Url.origin 
  
  // Try to use R2_BUCKET_NAME if provided, otherwise extract from the path
  const bucketName = process.env.R2_BUCKET_NAME || s3Url.pathname.replace('/', '') || 'videos'

  // We use aws4fetch instead of the official AWS SDK because aws4fetch is 100% compatible 
  // with Cloudflare Workers Edge Runtime, whereas the AWS SDK relies on Node.js modules.
  const aws = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
  })

  const extension = fileName.split('.').pop()
  const uniqueName = `${crypto.randomUUID()}-${Date.now()}.${extension}`

  const url = new URL(`/${bucketName}/${uniqueName}`, endpoint)

  const signedRequest = await aws.sign(url, {
    method: 'PUT',
    headers: {
      'Content-Type': fileType
    },
    aws: { signQuery: true }
  })

  const presignedUrl = signedRequest.url
  const publicUrl = `${process.env.PUPLIC_DEVELOPMENT_URL}/${uniqueName}`

  return { presignedUrl, publicUrl }
}
