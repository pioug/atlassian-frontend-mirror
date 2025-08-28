import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
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
	const {
		triggerHandler,
		items,
		errorInfo,
		decorationElement,
		decorationSet,
		query,
		selectedIndex,
	} = useSharedPluginStateWithSelector(api, ['typeAhead'], (states) => ({
		triggerHandler: states.typeAheadState?.triggerHandler,
		items: states.typeAheadState?.items,
		errorInfo: states.typeAheadState?.errorInfo,
		decorationElement: states.typeAheadState?.decorationElement,
		decorationSet: states.typeAheadState?.decorationSet,
		query: states.typeAheadState?.query,
		selectedIndex: states.typeAheadState?.selectedIndex,
	}));
	if (
		items === undefined ||
		decorationSet === undefined ||
		errorInfo === undefined ||
		decorationElement === undefined ||
		query === undefined ||
		selectedIndex === undefined
	) {
		return null;
	}

	if (
		// TODO: ED-26959 - Also requires a check for editor appearance (needs to be enabled for full-page/full-width editor only ?)
		!editorExperiment('platform_editor_insertion', 'control') &&
		triggerHandler?.id === TypeAheadAvailableNodes.QUICK_INSERT
	) {
		return (
			<TypeAheadMenuModern
				editorView={editorView}
				popupMountRef={popupMountRef}
				typeAheadState={{
					triggerHandler,
					items,
					errorInfo,
					decorationElement,
					decorationSet,
					query,
				}}
				api={api}
			/>
		);
	} else {
		return (
			<TypeAheadMenu
				editorView={editorView}
				popupMountRef={popupMountRef}
				typeAheadState={{
					triggerHandler,
					items,
					errorInfo,
					decorationElement,
					decorationSet,
					query,
				}}
				selectedIndex={selectedIndex}
				api={api}
			/>
		);
	}
}
