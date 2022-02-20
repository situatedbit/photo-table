import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const config = {
  bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  identity_pool_id: process.env.NEXT_PUBLIC_AWS_S3_IDENTITY_POOL_ID as string,
};

// See https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/photoExample/src/s3_PhotoExample.ts
export async function uploadFile(key: string, file: File) {
  const s3 = new S3Client({
    region: config.region,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: config.region }),
      identityPoolId: config.identity_pool_id,
    }),
  });

  const params = {
    Bucket: config.bucket,
    Key: key,
    Body: file,
  };

  await s3.send(new PutObjectCommand(params));
}

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  //The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function imageKeyRandomPrefix(): number {
  return getRandomIntInclusive(0, 999999);
}

/*
  Generate s3 key for file name.

  path: prefixes entire key, combined with forward slashes
  timestamp: current time stamp; will extract date
  randomPrefix: integer from which the last six digits will be extracted

  returns, e.g.,:
    [path]/[date]-[random digits]-[file name]
    e.g., images/2022-02-17-372893-some-file-name.jpg
*/
export function key(
  path: string[],
  timestamp: number,
  randomPrefix: number,
  name: string
): string {
  const pathPrefix = path.map((component) => component + "/").join("");
  const datePrefix = new Date(timestamp).toISOString().slice(0, 10);
  const randomPrefixPadded = String(randomPrefix).padStart(6, "0").slice(-6);

  // replace non-alpha-numeric characters with hyphen, then replace multiple
  // hyphens with single hyphen
  const nameSanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9.]/gi, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${pathPrefix}${datePrefix}-${randomPrefixPadded}-${nameSanitized}`;
}

export function url(key: string): string {
  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
}
