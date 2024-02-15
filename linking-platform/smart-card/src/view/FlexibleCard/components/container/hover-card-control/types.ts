import { ContainerProps } from '../types';

export type HoverCardDelayProps = Pick<
  ContainerProps,
  'hideHoverCardPreviewButton' | 'actionOptions'
> & {
  isHoverPreview?: boolean;
  isAuthTooltip?: boolean;
  testId?: string;
  url: string;
  delay?: number;
};
