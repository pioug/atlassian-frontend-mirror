import React from 'react';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { getAnalyticsEditorAppearance } from '@atlaskit/editor-common/utils';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { getPluginState } from '../pm-plugins/util/state';

export type EditorAnalyticsContextProps = {
	children: React.ReactNode;
	editorView?: EditorView;
};

/**
 * Provides location attribute to child events
 */
export const EditorAnalyticsContext = ({
	editorView,
	children,
}: EditorAnalyticsContextProps): React.JSX.Element => {
	const editorAppearance = editorView
		? getPluginState(editorView.state)?.editorAppearance
		: undefined;
	const analyticsEditorAppearance = getAnalyticsEditorAppearance(editorAppearance);

	const analyticsData = {
		attributes: {
			location: analyticsEditorAppearance,
		},
		// Below is added for the future implementation of Linking Platform namespaced analytic context
		location: analyticsEditorAppearance,
	};

	return <AnalyticsContext data={analyticsData}>{children}</AnalyticsContext>;
};
