import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import {
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type AnalyticsEventPayload,
} from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { logException } from '@atlaskit/editor-common/monitoring';
import {
	EditorToolbarProvider,
	EditorToolbarUIProvider,
	shouldShowSelectionToolbar,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	calculateToolbarPositionTrackHead,
	calculateToolbarPositionOnCellSelection,
} from '@atlaskit/editor-common/utils';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
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
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { ToolbarPlugin } from '../../toolbarPluginType';
import { SELECTION_TOOLBAR_LABEL } from '../consts';

import { getKeyboardNavigationConfig } from './keyboard-config';
import type { CalculateToolbarPosition, Position } from './types';
import { getDomRefFromSelection } from './utils';

const isToolbarComponent = (component: RegisterComponent): component is RegisterToolbar => {
	return component.type === 'toolbar' && component.key === 'inline-text-toolbar';
};

type SelectionToolbarProps = {
	api?: ExtractInjectionAPI<ToolbarPlugin>;
	calculateToolbarPosition?: CalculateToolbarPosition;
	disableSelectionToolbarWhenPinned: boolean;
	editorView: EditorView;
	mountPoint: HTMLElement | undefined;
};

const usePluginState = (api?: ExtractInjectionAPI<ToolbarPlugin>) => {
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
};

const useOnPositionCalculated = (
	editorView: EditorView,
	cachedCalculateToolbarPosition?: CalculateToolbarPosition,
) => {
	const onPositionCalculated = useCallback(
		(position: Position) => {
			try {
				// Show special position on cell selection only when editor controls experiment is enabled
				const isEditorControlsEnabled = expValEquals(
					'platform_editor_controls',
					'cohort',
					'variant1',
				);
				const isCellSelection = '$anchorCell' in editorView.state.selection;
				if (isCellSelection && isEditorControlsEnabled) {
					return calculateToolbarPositionOnCellSelection(SELECTION_TOOLBAR_LABEL)(
						editorView,
						position,
					);
				}

				return cachedCalculateToolbarPosition
					? cachedCalculateToolbarPosition(editorView, position)
					: calculateToolbarPositionTrackHead(SELECTION_TOOLBAR_LABEL)(editorView, position);
			} catch (error: unknown) {
				logException(error as Error, { location: 'editor-plugin-toolbar/selectionToolbar' });
				return position;
			}
		},
		[editorView, cachedCalculateToolbarPosition],
	);

	return onPositionCalculated;
};

export const SelectionToolbar = ({
	api,
	editorView,
	mountPoint,
	disableSelectionToolbarWhenPinned,
}: SelectionToolbarProps): React.JSX.Element | null => {
	const {
		connectivityStateMode,
		editorToolbarDockingPreference,
		currentUserIntent,
		shouldShowToolbar,
		editorViewMode,
	} = usePluginState(api);

	const contextualFormattingEnabled =
		api?.toolbar?.actions.contextualFormattingMode() ?? 'always-pinned';
	const selectionToolbarConfigEnabled = shouldShowSelectionToolbar(
		contextualFormattingEnabled,
		editorToolbarDockingPreference,
	);

	const intl = useIntl();
	const components = api?.toolbar?.actions.getComponents();
	const toolbar = components?.find((component) => isToolbarComponent(component));

	const keyboardNavigation = useMemo(() => {
		return getKeyboardNavigationConfig(editorView, intl, api);
	}, [editorView, intl, api]);

	const { isDisabled } = useToolbarUI();

	const isOffline = isOfflineMode(connectivityStateMode);
	const isTextSelection =
		!editorView.state.selection.empty && editorView.state.selection instanceof TextSelection;

	const isAllSelection =
		!editorView.state.selection.empty && editorView.state.selection instanceof AllSelection;

	const isCellSelection =
		!editorView.state.selection.empty && '$anchorCell' in editorView.state.selection;

	const onPositionCalculated = useOnPositionCalculated(editorView);

	if (
		(selectionToolbarConfigEnabled && disableSelectionToolbarWhenPinned) ||
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
		// hide toolbar when user intent is not default, except when it's dragHandleSelected without cell selection
		(currentUserIntent &&
			currentUserIntent !== 'default' &&
			!(currentUserIntent === 'dragHandleSelected' && !isCellSelection)) ||
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
				editorViewMode={editorViewMode ?? 'edit'}
				isOffline={isOffline}
			>
				<EditorToolbarUIProvider
					api={api}
					isDisabled={isDisabled}
					fireAnalyticsEvent={(payload: unknown) => {
						api?.analytics?.actions.fireAnalyticsEvent(payload as AnalyticsEventPayload);
					}}
					keyboardNavigation={keyboardNavigation}
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
	calculateToolbarPosition,
}: SelectionToolbarProps): React.JSX.Element => {
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
				calculateToolbarPosition={calculateToolbarPosition}
			/>
		</ErrorBoundary>
	);
};
