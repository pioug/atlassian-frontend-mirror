import type { CardProps } from '@atlaskit/smart-card';

export interface SmartLinksOptions {
	ssr?: boolean;
	showAuthTooltip?: boolean;
	hideHoverPreview?: boolean;
	actionOptions?: CardProps['actionOptions'];
	frameStyle?: CardProps['frameStyle'];
}
