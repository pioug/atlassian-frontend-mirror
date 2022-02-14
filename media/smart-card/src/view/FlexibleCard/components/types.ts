import { MessageDescriptor } from 'react-intl-next';

export type MessageProps = {
  descriptor: MessageDescriptor;
  values?: Record<string, string>;
};
