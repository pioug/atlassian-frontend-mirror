import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import {
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type AnalyticsEventPayload,
} from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import type { NamedPluginStatesFromInjectionAPI } from '@atlaskit/editor-common/hooks';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { logException } from '@atlaskit/editor-common/monitoring';
import { EditorToolbarProvider, EditorToolbarUIProvider } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import {
	calculateToolbarPositionTrackHead,
	calculateToolbarPositionOnCellSelection,
} from '@atlaskit/editor-common/utils';
import { AllSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	ToolbarSection,
	ToolbarButtonGroup,
	ToolbarDropdownItemSection,
	useToolbarUI,
} from '@atlaskit/editor-toolbar';
import { ToolbarModelRenderer } from '@atlaskit/editor-toolbar-model';
import type { RegisterToolbar, RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';
import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { ToolbarPlugin } from '../../toolbarPluginType';
import { SELECTION_TOOLBAR_LABEL } from '../consts';

import { getKeyboardNavigationConfig } from './keyboard-config';
import { getDomRefFromSelection } from './utils';

const isToolbarComponent = (component: RegisterComponent): component is RegisterToolbar => {
	return component.type === 'toolbar' && component.key === 'inline-text-toolbar';
};

type SelectionToolbarProps = {
	api?: ExtractInjectionAPI<ToolbarPlugin>;
	disableSelectionToolbarWhenPinned: boolean;
	editorView: EditorView;
	mountPoint: HTMLElement | undefined;
};

const usePluginState = conditionalHooksFactory(
	() => expValEquals('platform_editor_toolbar_aifc_patch_3', 'isEnabled', true),
	(api?: ExtractInjectionAPI<ToolbarPlugin>) => {
		return useSharedPluginStateWithSelector(
			api,
			['connectivity', 'userPreferences', 'toolbar', 'selection', 'userIntent', 'editorViewMode'],
			(state) => {
				return {
					connectivityStateMode: state.connectivityState?.mode,
					editorToolbarDockingPreference:
						state.userPreferencesState?.preferences?.toolbarDockingPosition,
					shouldShowToolbar: state.toolbarState?.shouldShowToolbar,
					selectedNode: state.toolbarState?.selectedNode,
					selection: state.selectionState?.selection,
					currentUserIntent: state.userIntentState?.currentUserIntent,
					editorViewMode: state.editorViewModeState?.mode,
				};
			},
		);
	},
	(api?: ExtractInjectionAPI<ToolbarPlugin>) => {
		const connectivityStateMode = useSharedPluginStateSelector(api, 'connectivity.mode');
		const editorToolbarDockingPreference = useSharedPluginStateSelector(
			api,
			'userPreferences.preferences.toolbarDockingPosition',
		);
		const currentUserIntent = useSharedPluginStateSelector(api, 'userIntent.currentUserIntent');
		const selection = useSharedPluginStateSelector(api, 'selection.selection');
		const { shouldShowToolbar, selectedNode } = useSharedPluginStateWithSelector(
			api,
			['toolbar'],
			(state: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<ToolbarPlugin>, 'toolbar'>) => {
				return {
					shouldShowToolbar: state.toolbarState?.shouldShowToolbar,
					selectedNode: state.toolbarState?.selectedNode,
				};
			},
		);

		return {
			connectivityStateMode,
			editorToolbarDockingPreference,
			currentUserIntent,
			shouldShowToolbar,
			selection,
			editorViewMode: undefined,
			selectedNode,
		};
	},
);

const useOnPositionCalculated = conditionalHooksFactory(
	() => fg('platform_editor_toolbar_aifc_patch_7'),
	(editorView: EditorView) => {
		const onPositionCalculated = useCallback(
			(position: { left?: number; top?: number }) => {
				try {
					const toolbarTitle = SELECTION_TOOLBAR_LABEL;

					// Show special position on cell selection only when editor controls experiment is enabled
					const isEditorControlsEnabled = expValEquals(
						'platform_editor_controls',
						'cohort',
						'variant1',
					);
					const isCellSelection = '$anchorCell' in editorView.state.selection;
					if (isCellSelection && isEditorControlsEnabled) {
						return calculateToolbarPositionOnCellSelection(toolbarTitle)(editorView, position);
					}
					return calculateToolbarPositionTrackHead(toolbarTitle)(editorView, position);
				} catch (error: unknown) {
					logException(error as Error, { location: 'editor-plugin-toolbar/selectionToolbar' });
					return position;
				}
			},
			[editorView],
		);

		return onPositionCalculated;
	},
	(editorView: EditorView) => {
		const onPositionCalculated = useCallback(
			(position: { left?: number; top?: number }) => {
				const toolbarTitle = SELECTION_TOOLBAR_LABEL;

				// Show special position on cell selection only when editor controls experiment is enabled
				const isEditorControlsEnabled = expValEquals(
					'platform_editor_controls',
					'cohort',
					'variant1',
				);
				const isCellSelection = '$anchorCell' in editorView.state.selection;
				if (isCellSelection && isEditorControlsEnabled) {
					return calculateToolbarPositionOnCellSelection(toolbarTitle)(editorView, position);
				}
				return calculateToolbarPositionTrackHead(toolbarTitle)(editorView, position);
			},
			[editorView],
		);

		return onPositionCalculated;
	},
);

export const SelectionToolbar = ({
	api,
	editorView,
	mountPoint,
	disableSelectionToolbarWhenPinned,
}: SelectionToolbarProps) => {
	const {
		connectivityStateMode,
		editorToolbarDockingPreference,
		currentUserIntent,
		shouldShowToolbar,
		editorViewMode,
		// @ts-ignore
		selection,
	} = usePluginState(api);

	const intl = useIntl();
	const components = api?.toolbar?.actions.getComponents();
	const toolbar = components?.find((component) => isToolbarComponent(component));

	const keyboardNavigation = useMemo(() => {
		return getKeyboardNavigationConfig(editorView, intl, api);
	}, [editorView, intl, api]);

	const { isDisabled } = useToolbarUI();

	const patch6Enabled = expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true);
	const isOffline = connectivityStateMode === 'offline';
	const isTextSelection =
		!editorView.state.selection.empty && editorView.state.selection instanceof TextSelection;

	const isAllSelection =
		!editorView.state.selection.empty && editorView.state.selection instanceof AllSelection;

	const isCellSelection =
		!editorView.state.selection.empty && '$anchorCell' in editorView.state.selection;

	const onPositionCalculated = useOnPositionCalculated(editorView);

	if (
		(expValEquals('platform_editor_toolbar_aifc_template_editor', 'isEnabled', true) &&
			editorToolbarDockingPreference === 'top' &&
			disableSelectionToolbarWhenPinned) ||
		!components ||
		!toolbar
	) {
		return null;
	}

	if (
		!(isTextSelection || isCellSelection || isAllSelection) ||
		currentUserIntent === 'dragging' ||
		!shouldShowToolbar ||
		(currentUserIntent === 'blockMenuOpen' &&
			expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) ||
		(currentUserIntent && currentUserIntent !== 'default') ||
		isSSR()
	) {
		return null;
	}

	return (
		<Popup
			offset={[0, 10]}
			target={getDomRefFromSelection(editorView)}
			onPositionCalculated={onPositionCalculated}
			mountTo={mountPoint}
		>
			<EditorToolbarProvider
				editorView={editorView}
				editorToolbarDockingPreference={editorToolbarDockingPreference}
				editorViewMode={
					expValEquals('platform_editor_toolbar_aifc_patch_4', 'isEnabled', true)
						? (editorViewMode ?? 'edit')
						: editorViewMode
				}
				isOffline={isOffline}
			>
				<EditorToolbarUIProvider
					api={api}
					isDisabled={patch6Enabled ? isDisabled : isOffline}
					// supress type checks for now
					fireAnalyticsEvent={
						expValEquals('platform_editor_toolbar_aifc_toolbar_analytic', 'isEnabled', true)
							? (payload: unknown) => {
									api?.analytics?.actions.fireAnalyticsEvent(payload as AnalyticsEventPayload);
								}
							: undefined
					}
					keyboardNavigation={
						expValEquals('platform_editor_toolbar_aifc_patch_5', 'isEnabled', true)
							? keyboardNavigation
							: undefined
					}
				>
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

export const SelectionToolbarWithErrorBoundary = ({
	api,
	editorView,
	mountPoint,
	disableSelectionToolbarWhenPinned,
}: SelectionToolbarProps) => {
	return (
		<ErrorBoundary
			component={ACTION_SUBJECT.TOOLBAR}
			componentId={ACTION_SUBJECT_ID.SELECTION_TOOLBAR}
			dispatchAnalyticsEvent={api?.analytics?.actions.fireAnalyticsEvent}
			fallbackComponent={null}
		>
			<SelectionToolbar
				api={api}
				editorView={editorView}
				mountPoint={mountPoint}
				disableSelectionToolbarWhenPinned={disableSelectionToolbarWhenPinned}
			/>
		</ErrorBoundary>
	);
};
