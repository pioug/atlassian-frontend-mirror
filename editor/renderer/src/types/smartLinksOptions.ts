import type { CardProps } from '@atlaskit/smart-card';

export interface SmartLinksOptions {
  ssr?: boolean;
  showAuthTooltip?: boolean;
  showServerActions?: boolean;
  frameStyle?: CardProps['frameStyle'];
}
