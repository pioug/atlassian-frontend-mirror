import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ActionProps } from '../components/Action';
import { messages } from '../../messages';

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
