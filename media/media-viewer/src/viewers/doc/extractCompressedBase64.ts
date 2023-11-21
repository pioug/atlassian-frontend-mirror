import { gunzip } from 'fflate';

export function extractCompressedBase64(
  data: string,
  output: 'blob',
): Promise<Blob>;
export function extractCompressedBase64(
  data: string,
  output: 'uint',
): Promise<Uint8Array>;
export function extractCompressedBase64(data: string): Promise<Uint8Array>;

export async function extractCompressedBase64(
  data: string,
  output: 'uint' | 'blob' = 'uint',
): Promise<unknown> {
  const response = await fetch(data);
  const zippedBinary = await response.arrayBuffer();

  const uint = new Uint8Array(zippedBinary);
  const decompressed = await new Promise<Uint8Array>((res, rej) =>
    gunzip(uint, (err, data) => (err ? rej(err) : res(data))),
  );
  if (output === 'uint') {
    return decompressed;
  }
  return new Response(decompressed).blob();
}
