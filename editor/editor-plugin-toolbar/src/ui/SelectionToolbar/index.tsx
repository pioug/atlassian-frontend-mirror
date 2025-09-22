import React, { useCallback, useMemo } from 'react';

import { useIntl, type IntlShape } from 'react-intl-next';

import { getDocument } from '@atlaskit/browser-apis';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import type { NamedPluginStatesFromInjectionAPI } from '@atlaskit/editor-common/hooks';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { fullPageMessages } from '@atlaskit/editor-common/messages';
import { EditorToolbarProvider, EditorToolbarUIProvider } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup, EDIT_AREA_ID } from '@atlaskit/editor-common/ui';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import {
	calculateToolbarPositionTrackHead,
	calculateToolbarPositionOnCellSelection,
} from '@atlaskit/editor-common/utils';
import { AllSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	ToolbarSection,
	ToolbarButtonGroup,
	ToolbarDropdownItemSection,
	type ToolbarKeyboardNavigationProviderConfig,
} from '@atlaskit/editor-toolbar';
import { ToolbarModelRenderer } from '@atlaskit/editor-toolbar-model';
import type { RegisterToolbar, RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { ToolbarPlugin } from '../../toolbarPluginType';
import { SELECTION_TOOLBAR_LABEL } from '../consts';
import { getFocusableElements, isShortcutToFocusToolbar } from '../utils/toolbar';

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
		// @ts-expect-error
		selection,
	} = usePluginState(api);

	const intl = useIntl();
	const components = api?.toolbar?.actions.getComponents();
	const toolbar = components?.find((component) => isToolbarComponent(component));

	const keyboardNavigation = useMemo(() => {
		return getKeyboardNavigationConfig(editorView, intl, api);
	}, [editorView, intl, api]);

	const isOffline = connectivityStateMode === 'offline';
	const isTextSelection =
		!editorView.state.selection.empty && editorView.state.selection instanceof TextSelection;

	const isAllSelection =
		!editorView.state.selection.empty &&
		editorView.state.selection instanceof AllSelection &&
		expValEquals('platform_editor_toolbar_aifc_patch_2', 'isEnabled', true);

	const isCellSelection =
		!editorView.state.selection.empty && '$anchorCell' in editorView.state.selection;

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
		(currentUserIntent &&
			currentUserIntent !== 'default' &&
			expValEquals('platform_editor_toolbar_aifc_patch_2', 'isEnabled', true)) ||
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
			>
				<EditorToolbarUIProvider
					api={api}
					isDisabled={isOffline}
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

const getKeyboardNavigationConfig = (
	editorView: EditorView,
	intl: IntlShape,
	api?: ExtractInjectionAPI<ToolbarPlugin>,
): ToolbarKeyboardNavigationProviderConfig | undefined => {
	if (!(editorView.dom instanceof HTMLElement)) {
		return;
	}

	const toolbarSelector = "[data-testid='editor-floating-toolbar']";

	return {
		childComponentSelector: toolbarSelector,
		dom: editorView.dom,
		isShortcutToFocusToolbar: isShortcutToFocusToolbar,
		handleFocus: (event: KeyboardEvent) => {
			const toolbar = getDocument()?.querySelector(toolbarSelector);
			if (!(toolbar instanceof HTMLElement)) {
				return;
			}
			const filteredFocusableElements = getFocusableElements(toolbar);
			filteredFocusableElements[0]?.focus();

			// the button element removes the focus ring so this class adds it back
			if (filteredFocusableElements[0]?.tagName === 'BUTTON') {
				filteredFocusableElements[0].classList.add('first-floating-toolbar-button');
			}
			filteredFocusableElements[0]?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest',
			});
			event.preventDefault();
			event.stopPropagation();
		},
		handleEscape: (event: KeyboardEvent) => {
			const isDropdownOpen = !!document.querySelector('[data-toolbar-component="menu-section"]');
			if (isDropdownOpen) {
				return;
			}
			api?.core.actions.focus();
			event.preventDefault();
			event.stopPropagation();
		},
		ariaControls: EDIT_AREA_ID,
		ariaLabel: intl.formatMessage(fullPageMessages.toolbarLabel),
	};
};
