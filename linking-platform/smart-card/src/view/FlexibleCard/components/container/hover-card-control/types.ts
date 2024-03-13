import { PropsWithChildren } from 'react';
import { ContainerProps } from '../types';

export type HoverCardDelayProps = PropsWithChildren<
  Pick<ContainerProps, 'hideHoverCardPreviewButton' | 'actionOptions'> & {
    isHoverPreview?: boolean;
    isAuthTooltip?: boolean;
    testId?: string;
    url: string;
    delay?: number;
  }
>;
