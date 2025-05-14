import React from 'react';

import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
} from '@atlaskit/editor-common/hooks';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
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

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<TypeAheadPlugin> | undefined) => {
		const triggerHandler = useSharedPluginStateSelector(api, 'typeAhead.triggerHandler');
		const items = useSharedPluginStateSelector(api, 'typeAhead.items');
		const errorInfo = useSharedPluginStateSelector(api, 'typeAhead.errorInfo');
		const decorationElement = useSharedPluginStateSelector(api, 'typeAhead.decorationElement');
		const decorationSet = useSharedPluginStateSelector(api, 'typeAhead.decorationSet');
		const query = useSharedPluginStateSelector(api, 'typeAhead.query');
		const selectedIndex = useSharedPluginStateSelector(api, 'typeAhead.selectedIndex');
		return {
			triggerHandler,
			items,
			errorInfo,
			decorationElement,
			decorationSet,
			query,
			selectedIndex,
		};
	},
	(api: ExtractInjectionAPI<TypeAheadPlugin> | undefined) => {
		const { typeAheadState } = useSharedPluginState(api, ['typeAhead']);
		return {
			triggerHandler: typeAheadState?.triggerHandler,
			items: typeAheadState?.items,
			errorInfo: typeAheadState?.errorInfo,
			decorationElement: typeAheadState?.decorationElement,
			decorationSet: typeAheadState?.decorationSet,
			query: typeAheadState?.query,
			selectedIndex: typeAheadState?.selectedIndex,
		};
	},
);

export function ContentComponent({ api, editorView, popupMountRef }: ContentComponentProps) {
	const {
		triggerHandler,
		items,
		errorInfo,
		decorationElement,
		decorationSet,
		query,
		selectedIndex,
	} = useSharedState(api);
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
