import React from 'react';

import { CoreEditor } from '../composable-editor/core-editor';
import { type EditorNextProps } from '../types/editor-props';
import { FullPageEditor as FullPage } from '../ui/Appearance/FullPage/FullPage';

export type FullWidthEditorProps = Pick<
	EditorNextProps,
	| 'preset'
	| 'defaultValue'
	| 'disabled'
	| 'mentionProvider'
	| 'performanceTracking'
	| 'contextIdentifierProvider'
	| 'searchProvider'
	| 'annotationProviders'
	| 'collabEditProvider'
	| 'collabEdit'
	| 'taskDecisionProvider'
	| 'extensionProviders'
	| 'shouldFocus'
	| 'quickInsert'
	| 'secondaryToolbarComponents'
	| 'featureFlags'
	| 'primaryToolbarComponents'
	| 'contextPanel'
	| 'contentComponents'
	| 'primaryToolbarIconBefore'
	| 'sanitizePrivateContent'
> & {
	onChange?: () => void;
	onEditorReady?: () => void;
};

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 * Editor component based on `ComposableEditor` which sets the `appearance` to "full-width".
 *
 * This has a performance benefit as it doesn't bundle unnecessary appearance code.
 *
 * Docs for `ComposableEditor` are also relevant: https://atlaskit.atlassian.com/packages/editor/editor-core
 *
 * @param props FullWidthEditorProps
 * @returns Editor component
 * @deprecated In favour of `FullPageEditor` with appearance "full-width"
 */
export function FullWidthEditor(props: FullWidthEditorProps) {
	return <CoreEditor {...props} appearance="full-width" AppearanceComponent={FullPage} />;
}
