import React, { useCallback, useEffect, useRef } from 'react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type {
	SelectionExtensionComponentProps,
	SelectionExtension,
	ExtensionMenuItemConfiguration,
} from '../../types';

type SelectionExtensionComponentWrapperProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined | null;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	editorView: EditorView;
};

export const SelectionExtensionComponentWrapper = ({
	api,
	editorAnalyticsAPI,
}: SelectionExtensionComponentWrapperProps) => {
	const componentRef = useRef<React.ComponentType<SelectionExtensionComponentProps>>();
	const isToolbarAIFCEnabled = editorExperiment('platform_editor_toolbar_aifc', true, {
		exposure: true,
	});
	const isToolbarAIFCSelectionExtensionEnabled = expValEquals(
		'platform_editor_toolbar_aifc_selection_extension',
		'isEnabled',
		true,
	);

	const { activeExtension, mode } = useSharedPluginStateWithSelector(
		api,
		['selectionExtension', 'editorViewMode'],
		(states) => ({
			activeExtension: states.selectionExtensionState?.activeExtension,
			mode: states.editorViewModeState?.mode,
		}),
	);

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
	}, [handleOnClose, mode]);

	// Viewed analytics event for component mount
	useEffect(() => {
		const extension = activeExtension?.extension;
		if (!extension) {
			return;
		}
		if (isToolbarAIFCEnabled && isToolbarAIFCSelectionExtensionEnabled) {
			let currentComponent: React.ComponentType<SelectionExtensionComponentProps> | undefined;

			if ('contentComponent' in extension && extension.contentComponent !== undefined) {
				currentComponent = extension.contentComponent;
			} else if ('component' in extension && extension.component !== undefined) {
				currentComponent = extension.component;
			}
			if (componentRef.current !== currentComponent && currentComponent !== undefined) {
				if (editorAnalyticsAPI) {
					editorAnalyticsAPI.fireAnalyticsEvent({
						action: ACTION.VIEWED,
						actionSubject: ACTION_SUBJECT.EDITOR_PLUGIN_SELECTION_EXTENSION,
						actionSubjectId: ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_COMPONENT,
						eventType: EVENT_TYPE.TRACK,
					});
				}
				// Sets reference to active component
				componentRef.current = currentComponent;
			}
			return;
		}
		// delete this when cleanup platform_editor_toolbar_aifc_selection_extension
		if (
			extension &&
			'component' in extension &&
			componentRef.current !== extension.component &&
			extension.component !== undefined
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
			componentRef.current = extension.component;
		}
	}, [
		activeExtension,
		editorAnalyticsAPI,
		isToolbarAIFCEnabled,
		isToolbarAIFCSelectionExtensionEnabled,
	]);
	const extension = activeExtension?.extension;
	if (!extension) {
		return null;
	}
	if (isToolbarAIFCEnabled && isToolbarAIFCSelectionExtensionEnabled) {
		const hasContentComponent = (ext: typeof extension): ext is ExtensionMenuItemConfiguration => {
			return 'contentComponent' in ext && ext.contentComponent !== undefined;
		};

		const hasComponent = (ext: typeof extension): ext is SelectionExtension => {
			return 'component' in ext && ext.component !== undefined;
		};

		let ExtensionComponent: React.ComponentType<SelectionExtensionComponentProps> | undefined;

		if (hasContentComponent(extension)) {
			ExtensionComponent = extension.contentComponent;
		} else if (hasComponent(extension)) {
			ExtensionComponent = extension.component;
		}

		if (!ExtensionComponent) {
			return null;
		}
		return (
			<ExtensionComponent closeExtension={handleOnClose} selection={activeExtension.selection} />
		);
	}

	// delete this when cleanup platform_editor_toolbar_aifc_selection_extension
	if (!('component' in extension) || !extension.component) {
		return null;
	}

	const ExtensionComponent = extension.component;
	return (
		<ExtensionComponent closeExtension={handleOnClose} selection={activeExtension.selection} />
	);
};
