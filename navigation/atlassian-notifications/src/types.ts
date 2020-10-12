import { DetailedHTMLProps, IframeHTMLAttributes } from 'react';

type IframeProps = DetailedHTMLProps<
  IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
>;

export type NotificationsProps = Omit<IframeProps, 'src'> & {
  // Reserved for testing, avoid using this
  _url?: string;
  locale?: string;
  product?: 'confluence' | 'jira' | string;
  testId?: string;
};
