export function mapDataUriToBlob(dataUri: string): Blob {
  const arr = dataUri.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
export const defaultBaseUrl = 'https://media.dev.atl-paas.net';
export const defaultCollectionName = 'MediaServicesSample';
export const testMediaFileId = 'a559980d-cd47-43e2-8377-27359fcb905f';
export const testVideoFileId = '0c3c64b9-65ad-4592-89d0-f838beebd81e';
export const testMediaGroupFileId = 'a3d20d67-14b1-4cfc-8ba8-918bbc8d71e1';
export const testMediaEmptyImageFileId = 'f7ea49e7-d55f-4c4b-b34c-bfd6409022bc';
export const getDateWithOffset = (offset: number) => {
  let time = new Date();
  time.setTime(time.getTime() + offset);
  return time;
};

export const getPastDate = () => {
  let offset = 0 - Math.round(Math.random() * 10000);
  return getDateWithOffset(offset);
};
