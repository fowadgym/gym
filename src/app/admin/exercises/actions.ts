'use server'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function getPresignedUrl(fileName: string, fileType: string) {
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials are not configured in .env.local')
  }

  // Parse endpoint and bucket name from the S3_API URL provided in .env
  // e.g. https://58e002dd28fff5092d8c460b27040b74.r2.cloudflarestorage.com/videos
  const s3Url = new URL(process.env.S3_API!)
  const endpoint = s3Url.origin 
  
  // Try to use R2_BUCKET_NAME if provided, otherwise extract from the path
  const bucketName = process.env.R2_BUCKET_NAME || s3Url.pathname.replace('/', '') || 'videos'

  const S3 = new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    }
  })

  const extension = fileName.split('.').pop()
  const uniqueName = `${crypto.randomUUID()}-${Date.now()}.${extension}`

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueName,
    ContentType: fileType,
  })

  const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })
  
  // Use the PUPLIC_DEVELOPMENT_URL from .env.local
  const publicUrl = `${process.env.PUPLIC_DEVELOPMENT_URL}/${uniqueName}`

  return { presignedUrl, publicUrl }
}
