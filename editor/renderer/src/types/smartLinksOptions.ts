import type { CardProps } from '@atlaskit/smart-card';

export interface SmartLinksOptions {
	ssr?: boolean;
	showAuthTooltip?: boolean;
	hideHoverPreview?: boolean;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
	 *
	 * Prefer `actionOptions` prop.
	 */
	showServerActions?: boolean;
	actionOptions?: CardProps['actionOptions'];
	frameStyle?: CardProps['frameStyle'];
}
