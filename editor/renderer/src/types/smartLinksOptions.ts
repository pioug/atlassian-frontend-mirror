import type React from 'react';

import type { CardProps } from '@atlaskit/smart-card';

export interface SmartLinksOptions {
	/**
	 * Configure visibility of actions available.
	 * By default, smart links show all actions available on the views.
	 * Set `hide` to true to disable all actions.
	 * Set `hide` to false and set `exclude` to enable only specific actions.
	 *
	 * Component: inline (hover preview), block (card)
	 */
	actionOptions?: CardProps['actionOptions'];
	/**
	 * Competitor Prompt Component for Competitor link
	 */
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	/**
	 * A prop that determines the style of a frame:
	 * whether to show it, hide it or only show it when a user hovers over embed.
	 * Default is `show`
	 *
	 * Component: embed
	 */
	frameStyle?: CardProps['frameStyle'];
	/**
	 * A flag to disable hover preview on inline Smart Link.
	 * Default is false.
	 *
	 * Component: inline
	 */
	hideHoverPreview?: boolean;
	/**
	 * A flag to enable inline Smart Link to render without lazy loading.
	 * Default is false.
	 *
	 * Component: inline
	 */
	ssr?: boolean;
	/**
	 * A Suspense boundary wrapper to enable inline SmartLinks to wait until data fetchers have completed before rendering
	 * Default is undefined.
	 *
	 * Component: inline
	 */
	SuspenseWrapperForUrl?: React.ComponentType<{ children: React.ReactNode; url?: string }>;
}
