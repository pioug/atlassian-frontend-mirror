import type React from 'react';

import { isModified, getRoutePathFromUrl, isTeamsAppRoute, prefixWithContextEntryPoint } from '../utils/utils';

import { classifyNavigationIntent } from './classifyNavigationIntent';

/**
 * Describes the type of link being created [(mapping reference)](https://hello.atlassian.net/wiki/spaces/PTC/pages/6618450101/LDR+Link+Intent+Mapping).
 */
export type NavigationIntent = 'navigation' | 'reference' | 'action' | 'external' | 'unknown';

export interface NavigationContext {
	/**
	 * Use this when TeamsLinks are consumed inside a preview panel. Navigation links in this context do not
	 * receive openPreviewPanel props (they are plain navigation links), so this flag is the only way for
	 * the link to know it is being rendered inside a preview panel and should open in a new tab.
	 */
	forceExternalIntent?: boolean;
	/**
	 * Performs SPA navigation to the specified URL. When omitted, routes use the browser's default
	 * navigation (full page load).
	 */
	navigate?: (url: string) => void;
	/**
	 * Opens a preview panel for the given ARI and name.
	 */
	openPreviewPanel?: (props: PreviewPanelOpenProps) => void;
	/**
	 * @deprecated This was previously used to prefix relative hrefs so they
	 * resolved correctly in each product context (e.g. `/wiki/people`). When
	 * providers were nested, the closest ancestor with a valid value took
	 * priority, falling back to the nearest ancestor.
	 */
	contextEntryPoint?: string;
}

/**
 * Props passed to `getNavigationProps`.
 */
export type NavigationIntentProps =
	| { intent: 'action'; previewPanelProps?: PreviewPanelProps }
	| { intent: Exclude<NavigationIntent, 'action'> };

type NavigationInput = NavigationIntentProps & {
	href: string;
	context: NavigationContext;
	onClick?: (...args: any[]) => void;
};

/**
 * Props passed by callers to TeamsAnchor for preview panel support.
 */
type PreviewPanelProps = {
	ari: string;
	name: string;
};

/**
 * Props passed to the `openPreviewPanel` callback.
 */
type PreviewPanelOpenProps = {
	ari: string;
	name: string;
	url: string;
};

/**
 * Return type of `getNavigationProps`.
 */
type NavigationByIntent =
	| {
			href: string;
			target: '_self';
			rel?: string;
			onClick?: (...args: any[]) => void;
	  }
	| {
			href: string;
			target: '_blank';
			rel: 'noopener noreferrer';
			onClick?: (...args: any[]) => void;
	  };

/**
 * Headless, pure function that determines how a link should behave.
 */
export function getNavigationProps(input: NavigationInput): NavigationByIntent {
	const { href: rawHref, intent, context, onClick: rawOnClick } = input;
	const previewPanelProps = 'previewPanelProps' in input ? input.previewPanelProps : undefined;
	const resolvedIntent = intent !== 'unknown' ? intent : classifyNavigationIntent(rawHref);

	// Prefix relative hrefs with the context entry point for the current product
	const href =
		resolvedIntent === 'external' || context.forceExternalIntent
			? rawHref
			: prefixWithContextEntryPoint(rawHref, context.contextEntryPoint ?? '');

	if (resolvedIntent === 'external' || context.forceExternalIntent) {
		return {
			href,
			target: '_blank',
			rel: 'noopener noreferrer',
			onClick: (...args: any[]) => {
				const e = args[0] as React.MouseEvent<HTMLAnchorElement>;
				rawOnClick?.(...args);
				if (e.defaultPrevented) return;
				e.preventDefault();
				window.open(href, '_blank', 'noopener noreferrer');
			},
		};
	}

	return {
		href,
		target: '_self',
		onClick: (...args: any[]) => {
			const e = args[0] as React.MouseEvent<HTMLAnchorElement>;
			rawOnClick?.(...args);
			if (e.defaultPrevented) return;

			// Handle left-click with modifier keys (let browser handle it)
			if (e.button === 0 && isModified(e)) return;

			if (previewPanelProps && context.openPreviewPanel) {
				e.preventDefault();
				context.openPreviewPanel({
					ari: previewPanelProps.ari,
					name: previewPanelProps.name,
					url: href,
				});
				return;
			}

			// Handle left-clicks without modifier keys
			if (
				context.navigate && // only use navigate when a handler is provided
				isTeamsAppRoute(href) && // only SPA navigate for townsquare routes
				e.button === 0 && // only use navigate for left mouse button clicks
				!isModified(e) // let browser handle clicks with modifier
			) {
				e.preventDefault();
				const routePath = getRoutePathFromUrl(href);
				context.navigate(routePath);
				return;
			}
		},
	};
}
