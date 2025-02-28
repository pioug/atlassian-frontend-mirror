import React, { useCallback, useEffect, useRef } from 'react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { SelectionExtensionComponentProps } from '../../types';

type SelectionExtensionComponentWrapperProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	editorView: EditorView;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
};

export const SelectionExtensionComponentWrapper = ({
	api,
	editorAnalyticsAPI,
}: SelectionExtensionComponentWrapperProps) => {
	const componentRef = useRef<React.ComponentType<SelectionExtensionComponentProps>>();
	const { selectionExtensionState, editorViewModeState } = useSharedPluginState(api, [
		'selectionExtension',
		'editorViewMode',
	]);

	// Closed from active extension
	const handleOnClose = useCallback(() => {
		api?.core.actions.execute(api?.selectionExtension.commands.clearActiveExtension());
		// Clears reference to active component
		componentRef.current = undefined;
		if (editorAnalyticsAPI) {
			editorAnalyticsAPI.fireAnalyticsEvent({
				action: ACTION.CLOSED,
				actionSubject: ACTION_SUBJECT.EDITOR_PLUGIN_SELECTION_EXTENSION,
				actionSubjectId: ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_COMPONENT,
				eventType: EVENT_TYPE.TRACK,
			});
		}
	}, [editorAnalyticsAPI, api]);

	// Closed from editor page mode change
	useEffect(() => {
		if (componentRef.current !== undefined) {
			handleOnClose();
		}
	}, [handleOnClose, editorViewModeState]);

	// Viewed analytics event for component mount
	useEffect(() => {
		if (
			componentRef.current !== selectionExtensionState?.activeExtension?.extension.component &&
			selectionExtensionState?.activeExtension?.extension.component !== undefined
		) {
			if (editorAnalyticsAPI) {
				editorAnalyticsAPI.fireAnalyticsEvent({
					action: ACTION.VIEWED,
					actionSubject: ACTION_SUBJECT.EDITOR_PLUGIN_SELECTION_EXTENSION,
					actionSubjectId: ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_COMPONENT,
					eventType: EVENT_TYPE.TRACK,
				});
			}
			// Sets reference to active component
			componentRef.current = selectionExtensionState?.activeExtension?.extension.component;
		}
	}, [selectionExtensionState, editorAnalyticsAPI]);

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
