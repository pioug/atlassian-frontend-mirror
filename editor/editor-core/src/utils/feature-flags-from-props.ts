import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';
import type { DisableSpellcheckByBrowser, FeatureFlags } from '@atlaskit/editor-common/types';

import type { EditorNextProps } from '../types/editor-props';

function verifyJSON(json: string) {
	try {
		return JSON.parse(json);
	} catch (e) {
		return undefined;
	}
}

function getSpellCheck(featureFlags: {
	[featureFlag: string]: string | boolean;
}): DisableSpellcheckByBrowser | undefined {
	if (!!featureFlags?.['disableSpellcheckByBrowser']) {
		return typeof featureFlags?.['disableSpellcheckByBrowser'] === 'object'
			? featureFlags?.['disableSpellcheckByBrowser']
			: typeof featureFlags?.['disableSpellcheckByBrowser'] === 'string'
				? verifyJSON(featureFlags?.['disableSpellcheckByBrowser'])
				: undefined;
	}
	if (!!featureFlags?.['disable-spellcheck-by-browser']) {
		return typeof featureFlags?.['disable-spellcheck-by-browser'] === 'object'
			? featureFlags?.['disable-spellcheck-by-browser']
			: typeof featureFlags?.['disable-spellcheck-by-browser'] === 'string'
				? verifyJSON(featureFlags?.['disable-spellcheck-by-browser'])
				: undefined;
	}
	return undefined;
}

/**
 * Transforms EditorProps to an FeatureFlags object,
 * which is used by both current and archv3 editors.
 */
export function createFeatureFlagsFromProps(
	featureFlags: EditorNextProps['featureFlags'],
): FeatureFlags {
	const normalizedFeatureFlags = normalizeFeatureFlags(featureFlags);

	return {
		...normalizedFeatureFlags,

		catchAllTracking: false,

		showAvatarGroupAsPlugin: Boolean(
			typeof featureFlags?.showAvatarGroupAsPlugin === 'boolean'
				? !!featureFlags?.showAvatarGroupAsPlugin
				: false,
		),

		errorBoundaryDocStructure: Boolean(
			typeof featureFlags?.useErrorBoundaryDocStructure === 'boolean'
				? !!featureFlags?.useErrorBoundaryDocStructure
				: false,
		),

		synchronyErrorDocStructure: Boolean(
			typeof featureFlags?.synchronyErrorDocStructure === 'boolean'
				? !!featureFlags?.synchronyErrorDocStructure
				: false,
		),

		enableViewUpdateSubscription: Boolean(
			typeof featureFlags?.enableViewUpdateSubscription === 'boolean'
				? !!featureFlags?.enableViewUpdateSubscription
				: false,
		),

		collabAvatarScroll: Boolean(
			typeof featureFlags?.collabAvatarScroll === 'boolean'
				? !!featureFlags?.collabAvatarScroll
				: false,
		),
		twoLineEditorToolbar: Boolean(
			typeof featureFlags?.twoLineEditorToolbar === 'boolean'
				? !!featureFlags?.twoLineEditorToolbar
				: false,
		),

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		disableSpellcheckByBrowser: getSpellCheck(featureFlags!),
	};
}
