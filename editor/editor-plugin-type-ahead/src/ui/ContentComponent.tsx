import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { TypeAheadPlugin } from '../typeAheadPluginType';
import type { PopupMountPointReference } from '../types';

import { TypeAheadMenu as TypeAheadMenuModern } from './modern/TypeAheadMenu';
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

	if (
		// TODO: Also requires a check for editor appearance (needs to be enabled for full-page/full-width editor only ?)
		!editorExperiment('platform_editor_insertion', 'control') &&
		typeAheadState.triggerHandler?.id === TypeAheadAvailableNodes.QUICK_INSERT
	) {
		return (
			<TypeAheadMenuModern
				editorView={editorView}
				popupMountRef={popupMountRef}
				typeAheadState={typeAheadState}
				api={api}
			/>
		);
	} else {
		return (
			<TypeAheadMenu
				editorView={editorView}
				popupMountRef={popupMountRef}
				typeAheadState={typeAheadState}
				api={api}
			/>
		);
	}
}
