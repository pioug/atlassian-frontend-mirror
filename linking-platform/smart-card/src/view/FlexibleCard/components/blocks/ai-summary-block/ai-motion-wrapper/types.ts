import type { PropsWithChildren } from 'react';

export type AIMotionWrapperProps = PropsWithChildren<{
  isFadeIn?: boolean;
  minHeight?: number;
  show: boolean;
  showTransition?: boolean;
}>;
