import type React from 'react';

import { isModified, getRoutePathFromUrl, isTeamsAppRoute } from '../utils/utils';

import { classifyNavigationIntent } from './classifyNavigationIntent';

const isAbsoluteLink = (url: string): boolean => {
	return url.startsWith('http') || url.startsWith('www');
};

/**
 * For a given arbitrary path, prefix it with the context entry point of the current product.
 * For example, in non teams app experiences where contextEntryPoint could be `/wiki/people`:
 * - Input: `team/123` → Output: `/wiki/people/team/123`
 * - Input: `https://example.com` → Output: `https://example.com` (absolute URLs are not prefixed)
 * - Input: `/wiki/people/team/123` → Output: `/wiki/people/team/123` (already prefixed)
 */
const prefixWithContextEntryPoint = (path: string, contextEntryPoint = ''): string => {
	if (
		isAbsoluteLink(path) ||
		!contextEntryPoint ||
		path.startsWith('/') ||
		path.startsWith(contextEntryPoint)
	) {
		return path;
	}

	return `${contextEntryPoint}/${path}`;
};

/**
 * Describes the type of link being created.
 *
 * Mapping reference: https://hello.atlassian.net/wiki/spaces/PTC/pages/6618450101/LDR+Link+Intent+Mapping
 */
export type NavigationIntent = 'navigation' | 'reference' | 'action' | 'external' | 'unknown';

export interface NavigationContext {
	cloudId: string;
	orgId: string;
	/**
	 * Use this when TeamsLinks are consumed inside a preview panel. Navigation links in this context do not
	 * receive openPreviewPanel props (they are plain navigation links), so this flag is the only way for
	 * the link to know it is being rendered inside a preview panel and should open in a new tab.
	 */
	forceExternalIntent: boolean;
	navigate: (url: string) => void;
	openPreviewPanel?: (props: PreviewPanelOpenProps) => void;
	/**
	 * The context entry point for the current product
	 * Used to prefix relative hrefs so they resolve correctly in each product context.
	 */
	contextEntryPoint?: string;
}

export type NavigationIntentProps =
	| { intent: 'action'; previewPanelProps?: PreviewPanelProps }
	| { intent: Exclude<NavigationIntent, 'action'> };

type NavigationInput = NavigationIntentProps & {
	href: string;
	context: NavigationContext;
};

/**
 * Props passed by callers to TeamsAnchor for preview panel support.
 */
type PreviewPanelProps = {
	ari: string;
	name: string;
};

/**
 * Props passed to the `openPreviewPanel` callback. `url` is always present,
 * falling back to the anchor's `href`.
 */
type PreviewPanelOpenProps = {
	ari: string;
	name: string;
	url: string;
};

type BaseNavigationResults = {
	href: string;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

type NavigationByIntent<I extends NavigationIntent> = BaseNavigationResults &
	(I extends 'external'
		? {
				intent: 'external';
				target: '_blank';
				rel: 'noopener noreferrer';
			}
		: {
				intent: Exclude<NavigationIntent, 'external'>;
				target: '_self';
				rel?: string;
			});

/**
 * Headless, pure function that determines how a link should behave.
 */
export function getNavigationProps(input: NavigationInput): NavigationByIntent<NavigationIntent> {
	const { href: rawHref, intent, context } = input;
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
			intent: 'external',
			target: '_blank',
			rel: 'noopener noreferrer',
			onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
				e.preventDefault();
				window.open(href, '_blank', 'noopener noreferrer');
				return;
			},
		};
	}

	return {
		href,
		intent: resolvedIntent,
		target: '_self',
		onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
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
