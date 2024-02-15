import type { TooltipProps } from '@atlaskit/tooltip';
import type { AIState } from '../types';

export type AIStateAppearance = 'default' | 'icon-only';

export type AIStateIndicatorProps = {
  appearance?: AIStateAppearance;
  state: AIState;
  testId?: string;
};

export type AIIndicatorContainerProps = {
  icon?: React.ReactNode;
  content?: React.ReactNode;
  testId?: string;
};

export type AIIndicatorTooltipProps = {
  content: TooltipProps['content'];
  trigger: React.ReactNode;
};
