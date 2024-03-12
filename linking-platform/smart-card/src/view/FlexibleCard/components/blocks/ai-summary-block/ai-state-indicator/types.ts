import type { XCSS } from '@atlaskit/primitives';
import type { TooltipProps } from '@atlaskit/tooltip';
import type { AISummaryStatus } from '../../../../../../state/hooks/use-ai-summary/ai-summary-service/types';

export type AIStateAppearance = 'default' | 'icon-only';

export type AIStateIndicatorProps = {
  appearance?: AIStateAppearance;
  state: AISummaryStatus;
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
  xcss?: XCSS;
};
