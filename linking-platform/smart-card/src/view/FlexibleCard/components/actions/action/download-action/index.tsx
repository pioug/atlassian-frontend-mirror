import React from 'react';
import { DownloadActionProps, DownloadFunctionProps } from './types';
import Action from '../index';

const DownloadAction: React.FC<DownloadActionProps> = (
  props: DownloadActionProps,
) => {
  const { appearance, asDropDownItem, downloadUrl, onClick, testId, url } =
    props;

  if (downloadUrl && url) {
    const action = {
      ...props,
      onClick: () => {
        downloadFunction({
          url: downloadUrl,
        });
        if (onClick) {
          onClick();
        }
      },
    };

    return (
      <Action
        {...action}
        appearance={appearance}
        asDropDownItem={asDropDownItem}
        testId={testId}
      />
    );
  } else {
    return null;
  }
};

async function downloadFunction({ url }: DownloadFunctionProps) {
  if (!url) {
    return;
  }
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
  link.download = url;

  link.target = isIE11 || isSafari ? '_blank' : iframeName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default DownloadAction;
