import React from 'react';

import type EditorActions from '../actions';
import { CoreEditor } from '../composable-editor/core-editor';
import { type EditorNextProps } from '../types/editor-props';
import { FullPageEditor as FullPage } from '../ui/Appearance/FullPage/FullPage';

export type FullPageEditorProps = Pick<
	EditorNextProps,
	| 'preset'
	| 'defaultValue'
	| 'disabled'
	| 'mentionProvider'
	| 'performanceTracking'
	| 'contextIdentifierProvider'
	| 'searchProvider'
	| 'activityProvider'
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
	| '__livePage'
> & {
	appearance: 'full-page' | 'full-width';
	onChange?: () => void;
	onEditorReady?: (editorActions: EditorActions) => void;
};

/**
 * Editor component based on `ComposableEditor` which sets the `appearance` to "full-page".
 *
 * This has a performance benefit as it doesn't bundle unnecessary appearance code.
 *
 * Docs for `ComposableEditor` are also relevant: https://atlaskit.atlassian.com/packages/editor/editor-core
 *
 * @param props FullPageEditorProps
 * @returns Editor component
 */
export function FullPageEditor(props: FullPageEditorProps) {
	return (
		<CoreEditor
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			appearance={props.appearance ?? 'full-page'}
			AppearanceComponent={FullPage}
			__livePage={props.__livePage}
		/>
	);
}
