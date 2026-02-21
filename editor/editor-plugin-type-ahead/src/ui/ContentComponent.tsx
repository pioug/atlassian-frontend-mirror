import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
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

export function ContentComponent({
	api,
	editorView,
	popupMountRef,
}: ContentComponentProps): React.JSX.Element | null {
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
