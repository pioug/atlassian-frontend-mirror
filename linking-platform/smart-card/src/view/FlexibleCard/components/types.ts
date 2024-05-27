import { type ReactNode } from 'react';
import { type MessageDescriptor } from 'react-intl-next';

export type AnchorTarget = '_blank' | '_self' | '_top' | '_parent';

export type MessageProps = {
  descriptor: MessageDescriptor;
  values?: Record<string, ReactNode>;
};
