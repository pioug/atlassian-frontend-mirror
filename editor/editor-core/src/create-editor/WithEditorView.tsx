import React from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { useEditorContext } from '../ui/EditorContext';

export interface WithEditorViewInternalProps {
	editorView?: EditorView | undefined;
}

export const WithEditorView = <P extends WithEditorViewInternalProps>(
	WrappedComponent: React.ComponentType<React.PropsWithChildren<P>>,
) => {
	const _WithFeatureFlags = (
		props: React.PropsWithChildren<Omit<P, keyof WithEditorViewInternalProps>>,
	) => {
		const { editorActions } = useEditorContext();

		return (
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			<WrappedComponent {...(props as P)} editorView={editorActions?._privateGetEditorView()} />
		);
	};

	return _WithFeatureFlags;
};
