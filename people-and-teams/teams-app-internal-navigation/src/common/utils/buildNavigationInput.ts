// A collection of utility functions for the teams-app-internal-navigation package.

import type { NavigationContext, NavigationIntentProps } from './getNavigationProps';

type BuildNavigationInputArgs = NavigationIntentProps & {
	href: string;
	context: NavigationContext;
	onBeforeNavigate?: (...args: any[]) => void;
};

/**
 * Builds the input object for `getNavigationProps`, handling the intent props.
 */
export function buildNavigationInput({
	href,
	context,
	onBeforeNavigate,
	...intentProps
}: BuildNavigationInputArgs):
	| {
			href: string;
			intent: 'action';
			previewPanelProps:
				| {
						ari: string;
						name: string;
				  }
				| undefined;
			context: NavigationContext;
			onClick: ((...args: any[]) => void) | undefined;
	  }
	| {
			href: string;
			intent: 'navigation' | 'reference' | 'external' | 'unknown';
			context: NavigationContext;
			onClick: ((...args: any[]) => void) | undefined;
			previewPanelProps?: undefined;
	  } {
	return intentProps.intent === 'action'
		? {
				href,
				intent: intentProps.intent,
				previewPanelProps: intentProps.previewPanelProps,
				context,
				onClick: onBeforeNavigate,
			}
		: { href, intent: intentProps.intent, context, onClick: onBeforeNavigate };
}
