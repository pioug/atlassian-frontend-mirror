export interface DownloadUrlOptions {
  name?: string;
}

export const downloadUrl = (url: string, options?: DownloadUrlOptions) => {
  const isIE11 =
    !!(window as any).MSInputMethodContext && !!(document as any).documentMode;
  const isSafari = /^((?!chrome|android).)*safari/i.test(
    (navigator as Navigator).userAgent,
  );

  const iframeName = 'media-download-iframe';
  const link = document.createElement('a');
  let iframe = document.getElementById(iframeName) as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.id = iframeName;
    iframe.name = iframeName;
    document.body.appendChild(iframe);
  }
  link.href = url;
  if (options && options.name) {
    link.download = options.name;
  }
  link.target = isIE11 || isSafari ? '_blank' : iframeName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
