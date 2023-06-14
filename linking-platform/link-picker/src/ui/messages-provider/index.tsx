import React from 'react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { LazyMessagesProvider } from './lazy-messages-provider';

export type MessagesIntlProviderProps = {
  children?: React.ReactNode;
};

export const MessagesProvider = ({ children }: MessagesIntlProviderProps) => {
  if (
    getBooleanFF('platform.linking-platform.link-picker.lazy-intl-messages')
  ) {
    return <LazyMessagesProvider>{children}</LazyMessagesProvider>;
  }

  return <>{children}</>;
};
