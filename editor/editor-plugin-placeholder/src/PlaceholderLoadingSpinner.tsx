import React from 'react';

import { cssMap } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyDocument } from '@atlaskit/editor-common/utils/document';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Box } from '@atlaskit/primitives/compiled/box';
import Spinner from '@atlaskit/spinner/spinner';

import type { PlaceholderPlugin } from './placeholderPluginType';

export const PlaceholderLoadingSpinner = ({
	api,
	editorView,
}: {
	api: ExtractInjectionAPI<PlaceholderPlugin> | undefined;
	editorView?: EditorView;
}): React.JSX.Element | null => {
	const isCollabInitializing = useSharedPluginStateWithSelector(
		api,
		['collabEdit'],
		({ collabEditState }) => !!collabEditState && !collabEditState.initialised.collabInitialisedAt,
	);
	const doc = editorView?.state.doc;

	if (!editorView || !isCollabInitializing || (doc && !isEmptyDocument(doc))) {
		return null;
	}

	// In this scenario
	// - the collab plugin exists - but we don't have a "initial/placeholder" document
	// - and the collab plugin is not yet ready
	// So we show a placeholder spinner to indicate the content is still loading
	return (
		<Box xcss={spinnerContainerStyles.spinnerContainer}>
			<Spinner interactionName="live-pages-loading-spinner" size="medium" />
		</Box>
	);
};

const spinnerContainerStyles = cssMap({
	spinnerContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
});
