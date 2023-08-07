import React from 'react';
import { DownloadActionProps } from './types';
import Action from '../index';
import { downloadUrl as download } from '../../../../../../utils';

const DownloadAction: React.FC<DownloadActionProps> = (
  props: DownloadActionProps,
) => {
  const { appearance, asDropDownItem, downloadUrl, onClick, testId, url } =
    props;

  if (downloadUrl && url) {
    const action = {
      ...props,
      onClick: () => {
        download(downloadUrl);
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

export default DownloadAction;
