import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export interface AriaLiveElementAttributes {
	priority?: 'important' | 'none';
}

export interface AccessibilityUtilsPluginState {
	ariaLiveElementAttributes?: AriaLiveElementAttributes;
	key?: string;
	message: string;
}

export type AccessibilityUtilsPlugin = NextEditorPlugin<
	'accessibilityUtils',
	{
		actions: {
			/**
			 *
			 * @param {string} message - Message to be announced to screen readers. This should be internationalized.
			 *
			 * These are currently announced via assertive live regions to screen readers.
			 *
			 * *In future, the ariaNotify proposal looks like a good fit for this use case.  The naming has been selected to align with this proposal.
			 */
			// The ariaNotify proposal looks like a good fit for this use case in future.
			// This is not currently implemented in any browser.
			// https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Accessibility/AriaNotify/explainer.md
			ariaNotify: (message: string, ariaLiveElementAttributes?: AriaLiveElementAttributes) => void;
		};
		dependencies: [];
		sharedState: AccessibilityUtilsPluginState;
	}
>;
