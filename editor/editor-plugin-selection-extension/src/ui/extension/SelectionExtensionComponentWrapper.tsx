import React, { useCallback, useEffect, useRef } from 'react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { SelectionExtensionComponentProps } from '../../types';

type SelectionExtensionComponentWrapperProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined | null;
	editorView: EditorView;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined | null) => {
		const { activeExtension, mode } = useSharedPluginStateWithSelector(
			api,
			['selectionExtension', 'editorViewMode'],
			(states) => ({
				activeExtension: states.selectionExtensionState?.activeExtension,
				mode: states.editorViewModeState?.mode,
			}),
		);
		return {
			editorViewModeState: undefined,
			mode,
			activeExtension,
		};
	},
	(api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined | null) => {
		const { selectionExtensionState, editorViewModeState } = useSharedPluginState(api, [
			'selectionExtension',
			'editorViewMode',
		]);
		return {
			editorViewModeState,
			mode: editorViewModeState?.mode,
			activeExtension: selectionExtensionState?.activeExtension,
		};
	},
);

export const SelectionExtensionComponentWrapper = ({
	api,
	editorAnalyticsAPI,
}: SelectionExtensionComponentWrapperProps) => {
	const componentRef = useRef<React.ComponentType<SelectionExtensionComponentProps>>();
	const { editorViewModeState, activeExtension, mode } = useSharedState(api);

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
	}, [handleOnClose, editorViewModeState, mode]);

	// Viewed analytics event for component mount
	useEffect(() => {
		if (
			componentRef.current !== activeExtension?.extension.component &&
			activeExtension?.extension.component !== undefined
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
			componentRef.current = activeExtension?.extension.component;
		}
	}, [activeExtension, editorAnalyticsAPI]);

	if (!activeExtension?.extension.component) {
		return null;
	}

	const ExtensionComponent = activeExtension.extension.component;
	return (
		<ExtensionComponent closeExtension={handleOnClose} selection={activeExtension.selection} />
	);
};
