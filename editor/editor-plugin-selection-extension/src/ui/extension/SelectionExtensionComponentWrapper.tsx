import React, { useCallback, useEffect } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';

type SelectionExtensionComponentWrapperProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	editorView: EditorView;
};

export const SelectionExtensionComponentWrapper = ({
	api,
}: SelectionExtensionComponentWrapperProps) => {
	const { selectionExtensionState, editorViewModeState } = useSharedPluginState(api, [
		'selectionExtension',
		'editorViewMode',
	]);

	const handleOnClose = useCallback(() => {
		api?.core.actions.execute(api?.selectionExtension.commands.clearActiveExtension());
	}, [api]);

	useEffect(() => {
		api?.core.actions.execute(api?.selectionExtension.commands.clearActiveExtension());
	}, [editorViewModeState, api]);

	if (!selectionExtensionState?.activeExtension?.extension.component) {
		return null;
	}

	const ExtensionComponent = selectionExtensionState.activeExtension.extension.component;
	return (
		<ExtensionComponent
			closeExtension={handleOnClose}
			selection={selectionExtensionState.activeExtension.selection}
		/>
	);
};
