import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TypeAheadPlugin } from '../typeAheadPluginType';
import type { PopupMountPointReference } from '../types';

import { TypeAheadMenu } from './TypeAheadMenu';

interface ContentComponentProps {
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	editorView: EditorView;
	popupMountRef: PopupMountPointReference;
}

export function ContentComponent({ api, editorView, popupMountRef }: ContentComponentProps) {
	const { typeAheadState } = useSharedPluginState(api, ['typeAhead']);
	if (!typeAheadState) {
		return null;
	}
	return (
		<TypeAheadMenu
			editorView={editorView}
			popupMountRef={popupMountRef}
			typeAheadState={typeAheadState}
			api={api}
		/>
	);
}
