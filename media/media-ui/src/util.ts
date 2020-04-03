import { FileInfo } from './imageMetaData/types';

export function dataURItoFile(
  dataURI: string,
  filename: string = 'untitled',
): File {
  if (dataURI.length === 0) {
    throw new Error('dataURI not found');
  }

  // convert base64/URLEncoded data component to raw binary data held in a string
  const dataURIParts = dataURI.split(',');
  const byteString =
    dataURIParts[0].indexOf('base64') >= 0
      ? atob(dataURIParts[1])
      : decodeURIComponent(dataURIParts[1]);

  // separate out the mime component
  let mimeString;
  try {
    mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
  } catch (e) {
    // https://stackoverflow.com/questions/1176022/unknown-file-type-mime
    mimeString = 'application/octet-stream';
  }

  // write the bytes of the string to a typed array
  const intArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([intArray], { type: mimeString });
  try {
    return new File([blob], filename, { type: mimeString });
  } catch (e) {
    // IE11 does not allow the File constructor (yay!)
    // we get around this by decorating the blob instance with File properties
    // effectively casting up from Blob to File.
    const ie11File: any = blob;
    const date = new Date();
    ie11File.lastModified = date.getTime();
    ie11File.lastModifiedDate = date;
    ie11File.name = filename;
    ie11File.webkitRelativePath = '';
    return ie11File;
  }
}

export function fileToDataURI(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else if (result === null) {
        reject();
      }
    });
    reader.addEventListener('error', reject);
    reader.readAsDataURL(blob);
  });
}

export async function getFileInfo(file: File, src?: string): Promise<FileInfo> {
  return {
    file,
    src: src || (await fileToDataURI(file)),
  };
}

export async function getFileInfoFromSrc(
  src: string,
  file?: File,
): Promise<FileInfo> {
  return {
    file: file || (await dataURItoFile(src)),
    src,
  };
}

export function fileToArrayBuffer(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const array = new Uint8Array(reader.result as ArrayBuffer);
      resolve(array);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
  });
}

export const findParentByClassname = (
  element: HTMLElement,
  className: string,
  maxParentElement: HTMLElement = document.body,
): HTMLElement | undefined => {
  if (element.classList.contains(className)) {
    return element;
  }

  let currentElement = element;

  while (currentElement.parentElement !== maxParentElement) {
    if (currentElement.parentElement) {
      currentElement = currentElement.parentElement;

      if (currentElement.classList.contains(className)) {
        return currentElement;
      }
    } else {
      return undefined;
    }
  }

  return undefined;
};
