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
export const getDateWithOffset = (offset: number) => {
  let time = new Date();
  time.setTime(time.getTime() + offset);
  return time;
};

export const getPastDate = () => {
  let offset = 0 - Math.round(Math.random() * 10000);
  return getDateWithOffset(offset);
};
