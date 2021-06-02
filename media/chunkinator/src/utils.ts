import { ChunkinatorFile } from './domain';

export async function fetchBlob(file: ChunkinatorFile): Promise<Blob> {
  if (typeof file === 'string') {
    return await fetch(file).then((response) => response.blob());
  } else {
    return file;
  }
}
