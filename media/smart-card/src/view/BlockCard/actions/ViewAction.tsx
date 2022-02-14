import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { ActionProps } from '../components/Action';
import { messages } from '@atlaskit/media-ui/messages';

export interface ViewFunctionArg {
  url?: string;
}

export async function viewFunction({ url }: ViewFunctionArg) {
  if (!url) {
    return;
  }

  window.open(url, '_blank', 'noopener=yes');
}

export const ViewAction = ({ url }: { url?: string }): ActionProps => ({
  id: 'view-content',
  text: <FormattedMessage {...messages.view} />,
  promise: () =>
    viewFunction({
      url,
    }),
});
