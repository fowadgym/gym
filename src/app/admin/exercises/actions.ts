'use server'

import { AwsClient } from 'aws4fetch'

export async function getPresignedUrl(fileName: string, fileType: string) {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || 'b06b8a10fcf50dbda8b6d0ffab343e50'
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || 'd35f2a17199e267b5c231a22ebf08b5bdd2910aae4c0fac23e9cdbebc51fcec9'
  const s3Api = process.env.S3_API || 'https://58e002dd28fff5092d8c460b27040b74.r2.cloudflarestorage.com/videos'
  const devUrl = process.env.PUPLIC_DEVELOPMENT_URL || 'https://pub-a47cdbe488fa40b79f210c8c35ccc622.r2.dev'

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials are not configured in production environment variables.')
  }

  // Parse endpoint and bucket name from the S3_API URL provided in .env
  const s3Url = new URL(s3Api)
  const endpoint = s3Url.origin 
  
  // Try to use R2_BUCKET_NAME if provided, otherwise extract from the path
  const bucketName = process.env.R2_BUCKET_NAME || s3Url.pathname.replace('/', '') || 'videos'

  // We use aws4fetch instead of the official AWS SDK because aws4fetch is 100% compatible 
  // with Cloudflare Workers Edge Runtime, whereas the AWS SDK relies on Node.js modules.
  const aws = new AwsClient({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
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
  const publicUrl = `${devUrl}/${uniqueName}`

  return { presignedUrl, publicUrl }
}
