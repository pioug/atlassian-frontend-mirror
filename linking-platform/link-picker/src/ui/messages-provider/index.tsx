import React from 'react';

import { LazyMessagesProvider } from './lazy-messages-provider';

export type MessagesIntlProviderProps = {
  children?: React.ReactNode;
};

export const MessagesProvider = ({ children }: MessagesIntlProviderProps) => {
  return <LazyMessagesProvider>{children}</LazyMessagesProvider>;
};
