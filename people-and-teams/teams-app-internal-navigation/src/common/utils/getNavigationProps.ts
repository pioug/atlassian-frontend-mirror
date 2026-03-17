import type React from 'react';

import { classifyUrl } from './classifyUrl';

/**
 * Describes the type of link being created.
 *
 * Mapping reference: https://hello.atlassian.net/wiki/spaces/PTC/pages/6618450101/LDR+Link+Intent+Mapping
 */
export type NavigationIntent = 'navigation' | 'reference' | 'action' | 'external' | 'unknown';

export interface NavigationContext {
	cloudId: string;
	orgId: string;
	openLinksInNewTab: boolean;
	push: (url: string) => void;
}

export interface NavigationInput {
	href: string;
	intent: NavigationIntent;
	previewPanelProps?: previewPanelProps;
	context: NavigationContext;
}

export type previewPanelProps = {
	ari: string;
	name: string;
};

type baseNavigationResults = {
	href: string;
	onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};
  
type NavigationByIntent<I extends NavigationIntent> = baseNavigationResults &
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
export function getNavigationProps(
	{ href, intent }: NavigationInput,
): NavigationByIntent<NavigationIntent> {
	const resolvedIntent = intent !== 'unknown' ? intent : classifyUrl();

	switch (resolvedIntent) {
		case 'external':
			return { href, intent: 'external', target: '_blank', rel: 'noopener noreferrer' };
		case 'navigation':
		case 'reference':
		case 'action':
		case 'unknown':
		default:
			return { href, intent: resolvedIntent, target: '_self' };
	}
}