import * as url from 'url';

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

export function getWsUrl(baseUrl: string, path: string): string {
  const { protocol, host } = url.parse(baseUrl);
  const wsProtocol = protocol === 'http:' ? 'ws:' : 'wss:';

  return `${wsProtocol}//${host}${path}`;
}
