import React from 'react';
import { FormattedMessage } from 'react-intl';
import { downloadUrl } from '@atlaskit/media-common';

import { ActionProps } from '../components/Action';
import { messages } from '../../messages';

export interface DownloadFunctionArg {
  url?: string;
}

export async function downloadFunction({ url }: DownloadFunctionArg) {
  if (!url) {
    return;
  }

  downloadUrl(url);
}

export const DownloadAction = ({ url }: { url?: string }): ActionProps => ({
  id: 'download-content',
  text: <FormattedMessage {...messages.download} />,
  promise: () =>
    downloadFunction({
      url,
    }),
});
