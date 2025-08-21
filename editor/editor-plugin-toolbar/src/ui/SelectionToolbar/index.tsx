import React from 'react';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { EditorToolbarProvider, EditorToolbarUIProvider } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { calculateToolbarPositionTrackHead } from '@atlaskit/editor-common/utils';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	ToolbarSection,
	ToolbarButtonGroup,
	ToolbarDropdownItemSection,
} from '@atlaskit/editor-toolbar';
import { ToolbarModelRenderer } from '@atlaskit/editor-toolbar-model';
import type { RegisterToolbar, RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { ToolbarPlugin } from '../../toolbarPluginType';
import { SELECTION_TOOLBAR_LABEL } from '../consts';

const isToolbarComponent = (component: RegisterComponent): component is RegisterToolbar => {
	return component.type === 'toolbar' && component.key === 'inline-text-toolbar';
};

type SelectionToolbarProps = {
	editorView: EditorView;
	api?: ExtractInjectionAPI<ToolbarPlugin>;
	mountPoint: HTMLElement | undefined;
};

export const SelectionToolbar = ({ api, editorView, mountPoint }: SelectionToolbarProps) => {
	const components = api?.toolbar.actions.getComponents();
	const toolbar = components?.find((component) => isToolbarComponent(component));

	const currentUserIntent = useSharedPluginStateSelector(api, 'userIntent.currentUserIntent');
	const connectivityStateMode = useSharedPluginStateSelector(api, 'connectivity.mode');
	const isOffline = connectivityStateMode === 'offline';
	// TODO: ED-28735 - figure out a better way to control this - needed to re-render on selection change
	// @ts-expect-error
	const selection = useSharedPluginStateSelector(api, 'selection.selection');
	const isTextSelection =
		!editorView.state.selection.empty && editorView.state.selection instanceof TextSelection;
	const isCellSelection =
		!editorView.state.selection.empty && '$anchorCell' in editorView.state.selection;

	if (!components || !toolbar) {
		return null;
	}

	if (
		!(isTextSelection || isCellSelection) ||
		currentUserIntent === 'dragging' ||
		(currentUserIntent === 'blockMenuOpen' &&
			expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) ||
		isSSR()
	) {
		return null;
	}

	return (
		<Popup
			offset={[0, 10]}
			target={getDomRefFromSelection(editorView)}
			onPositionCalculated={(position) =>
				calculateToolbarPositionTrackHead(SELECTION_TOOLBAR_LABEL)(editorView, position)
			}
			mountTo={mountPoint}
		>
			<EditorToolbarProvider editorView={editorView}>
				<EditorToolbarUIProvider api={api} isDisabled={isOffline}>
					<ToolbarModelRenderer
						toolbar={toolbar as RegisterToolbar}
						components={components}
						fallbacks={{
							section: ToolbarSection,
							menuSection: ToolbarDropdownItemSection,
							group: ToolbarButtonGroup,
						}}
					/>
				</EditorToolbarUIProvider>
			</EditorToolbarProvider>
		</Popup>
	);
};

const getDomRefFromSelection = (
	view: EditorView,
	// dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => {
	try {
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		return findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view)) as HTMLElement;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		// // eslint-disable-next-line no-console
		// console.warn(error);
		// if (dispatchAnalyticsEvent) {
		// 	const payload: AnalyticsEventPayload = {
		// 		action: ACTION.ERRORED,
		// 		actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
		// 		eventType: EVENT_TYPE.OPERATIONAL,
		// 		attributes: {
		// 			component: CONTENT_COMPONENT.FLOATING_TOOLBAR,
		// 			selection: view.state.selection.toJSON(),
		// 			position: view.state.selection.from,
		// 			docSize: view.state.doc.nodeSize,
		// 			error: error.toString(),
		// 			// @ts-expect-error - Object literal may only specify known properties, 'errorStack' does not exist in type
		// 			// This error was introduced after upgrading to TypeScript 5
		// 			errorStack: error.stack || undefined,
		// 		},
		// 	};
		// 	dispatchAnalyticsEvent(payload);
		// }
	}
};
