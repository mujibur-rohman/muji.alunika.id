import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION ?? "ap-southeast-1";
const bucket = process.env.AWS_S3_BUCKET ?? "mujialunika";

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // Keep checksum params out of presigned URLs so browser PUT uploads don't fail
  // a checksum mismatch (SDK v3 signs a CRC32 of an empty body at presign time).
  requestChecksumCalculation: "WHEN_REQUIRED",
});

export async function getUploadPresignedUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });
  return url;
}

export async function deleteS3Object(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3.send(command);
}

export function getS3Url(key: string) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
