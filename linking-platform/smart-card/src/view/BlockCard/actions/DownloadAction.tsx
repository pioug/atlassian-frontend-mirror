import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { type ActionProps } from '../components/Action';
import { messages } from '../../../messages';
import { downloadUrl } from '../../../utils';

export const DownloadAction = ({ url }: { url?: string }): ActionProps => ({
  id: 'download-content',
  text: <FormattedMessage {...messages.download} />,
  promise: () => downloadUrl(url),
});
