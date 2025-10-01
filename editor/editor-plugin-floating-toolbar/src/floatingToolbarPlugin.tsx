import React from 'react';

import camelCase from 'lodash/camelCase';
import type { IntlShape } from 'react-intl-next';

import type {
	AnalyticsEventPayload,
	DispatchAnalyticsEvent,
	FLOATING_CONTROLS_TITLE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	CONTENT_COMPONENT,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import {
	// Deprecated API - Look at removing this sometime in the future
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarButton,
	FloatingToolbarConfig,
	FloatingToolbarHandler,
	FloatingToolbarOverflowDropdown,
	PMPlugin,
	UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import type { PopupPosition as Position } from '@atlaskit/editor-common/ui';
import { Popup } from '@atlaskit/editor-common/ui';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { AllSelection, PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type {
	ConfigWithNodeInfo,
	FloatingToolbarPlugin,
	FloatingToolbarPluginState,
} from './floatingToolbarPluginType';
import { copyNode } from './pm-plugins/commands';
import forceFocusPlugin, { forceFocusSelector } from './pm-plugins/force-focus';
import { hideConfirmDialog } from './pm-plugins/toolbar-data/commands';
import { createPlugin as floatingToolbarDataPluginFactory } from './pm-plugins/toolbar-data/plugin';
import { pluginKey as dataPluginKey } from './pm-plugins/toolbar-data/plugin-key';
import { findNode } from './pm-plugins/utils';
import { ConfirmationModal } from './ui/ConfirmationModal';
import Toolbar from './ui/Toolbar';
import { consolidateOverflowDropdownItems } from './ui/utils';

// TODO: AFP-2532 - Fix automatic suppressions below
export const getRelevantConfig = (
	selection: Selection,
	configs: Array<FloatingToolbarConfig>,
): ConfigWithNodeInfo | undefined => {
	// node selections always take precedence, see if
	let configPair: ConfigWithNodeInfo | undefined;
	configs.find((config) => {
		const node = findSelectedNodeOfType(config.nodeType)(selection);
		if (node) {
			configPair = {
				node: node.node,
				pos: node.pos,
				config,
			};
		}

		return !!node;
	});

	if (configPair) {
		return configPair;
	}

	// create mapping of node type name to configs
	const configByNodeType: Record<string, FloatingToolbarConfig> = {};
	configs.forEach((config) => {
		if (Array.isArray(config.nodeType)) {
			config.nodeType.forEach((nodeType) => {
				configByNodeType[nodeType.name] = config;
			});
		} else {
			configByNodeType[config.nodeType.name] = config;
		}
	});

	// search up the tree from selection
	const { $from } = selection;
	for (let i = $from.depth; i > 0; i--) {
		const node = $from.node(i);

		const matchedConfig = configByNodeType[node.type.name];
		if (matchedConfig) {
			return { config: matchedConfig, node: node, pos: $from.pos };
		}
	}

	// if it is AllSelection (can be result of Cmd+A) - use first node
	if (selection instanceof AllSelection) {
		const docNode = $from.node(0);

		let matchedConfig: FloatingToolbarConfig | null = null;
		const firstChild = findNode(docNode, (node) => {
			matchedConfig = configByNodeType[node.type.name];
			return !!matchedConfig;
		});
		if (firstChild && matchedConfig) {
			return { config: matchedConfig, node: firstChild, pos: $from.pos };
		}
	}

	return;
};

const getDomRefFromSelection = (
	view: EditorView,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => {
	try {
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		return findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view)) as HTMLElement;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		// eslint-disable-next-line no-console
		console.warn(error);
		if (dispatchAnalyticsEvent) {
			const payload: AnalyticsEventPayload = {
				action: ACTION.ERRORED,
				actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					component: CONTENT_COMPONENT.FLOATING_TOOLBAR,
					selection: view.state.selection.toJSON(),
					position: view.state.selection.from,
					docSize: view.state.doc.nodeSize,
					error: error.toString(),
					// @ts-expect-error - Object literal may only specify known properties, 'errorStack' does not exist in type
					// This error was introduced after upgrading to TypeScript 5
					errorStack: error.stack || undefined,
				},
			};
			dispatchAnalyticsEvent(payload);
		}
	}
};

function filterUndefined<T>(x?: T): x is T {
	return !!x;
}

export const floatingToolbarPlugin: FloatingToolbarPlugin = ({ api }) => {
	return {
		name: 'floatingToolbar',

		pmPlugins(floatingToolbarHandlers: Array<FloatingToolbarHandler> = []) {
			const plugins: PMPlugin[] = [
				{
					// Should be after all toolbar plugins
					name: 'floatingToolbar',
					plugin: ({ providerFactory, getIntl }) =>
						floatingToolbarPluginFactory({
							floatingToolbarHandlers,
							providerFactory,
							getIntl,
						}),
				},
				{
					name: 'floatingToolbarData',
					plugin: ({ dispatch }) => floatingToolbarDataPluginFactory(dispatch),
				},
				{
					name: 'forceFocus',
					plugin: () => forceFocusPlugin(),
				},
			];

			return plugins;
		},

		actions: {
			forceFocusSelector,
		},
		commands: {
			copyNode: (nodeType: NodeType | NodeType[], inputMethod?: INPUT_METHOD) =>
				copyNode(nodeType, api?.analytics?.actions, inputMethod),
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}

			const interactionState = api?.interaction?.sharedState.currentState()?.interactionState;

			const configWithNodeInfo =
				interactionState !== 'hasNotHadInteraction'
					? (pluginKey.getState(editorState)?.getConfigWithNodeInfo?.(editorState) ?? undefined)
					: undefined;

			return {
				configWithNodeInfo,
				floatingToolbarData: dataPluginKey.getState(editorState),
			};
		},

		contentComponent({
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			editorView,
			providerFactory,
			dispatchAnalyticsEvent,
		}) {
			if (!editorView) {
				return null;
			}

			return (
				<ContentComponent
					editorView={editorView}
					pluginInjectionApi={api}
					popupsMountPoint={popupsMountPoint}
					popupsBoundariesElement={popupsBoundariesElement}
					popupsScrollableElement={popupsScrollableElement}
					providerFactory={providerFactory}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
				/>
			);
		},
	};
};

/**
 * React component that renders the floating toolbar UI for the editor.
 *
 * This component manages the display of floating toolbars based on the current editor state,
 * selection, and configuration. It handles visibility conditions, positioning, toolbar items
 * consolidation, and confirmation dialogs.
 *
 * @param props - Component properties
 * @param props.pluginInjectionApi - Plugin injection API for accessing other plugin states
 * @param props.editorView - ProseMirror EditorView instance
 * @param props.popupsMountPoint - DOM element where popups should be mounted
 * @param props.popupsBoundariesElement - Element that defines popup boundaries
 * @param props.popupsScrollableElement - Scrollable container element for popups
 * @param props.providerFactory - Factory for creating various providers
 * @param props.dispatchAnalyticsEvent - Function to dispatch analytics events
 * @returns JSX element representing the floating toolbar or null if not visible
 */
export function ContentComponent({
	pluginInjectionApi,
	editorView,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	providerFactory,
	dispatchAnalyticsEvent,
}: Pick<
	UiComponentFactoryParams,
	| 'editorView'
	| 'popupsMountPoint'
	| 'popupsBoundariesElement'
	| 'providerFactory'
	| 'dispatchAnalyticsEvent'
	| 'popupsScrollableElement'
> & {
	pluginInjectionApi: ExtractInjectionAPI<FloatingToolbarPlugin> | undefined;
} & { editorView: EditorView }) {
	const {
		floatingToolbarState,
		editorDisabledState,
		editorViewModeState,
		userIntentState,
		// @ts-expect-error - excluded from FloatingToolbarPlugin dependencies to avoid circular dependency
		blockControlsState,
	} = useSharedPluginState(pluginInjectionApi, [
		'floatingToolbar',
		'editorDisabled',
		'editorViewMode',
		'userIntent',
		// @ts-expect-error - excluded from FloatingToolbarPlugin dependencies to avoid circular dependency
		'blockControls',
	]);

	const { configWithNodeInfo, floatingToolbarData } = floatingToolbarState ?? {};

	if (isSSR()) {
		return null;
	}

	if (
		!configWithNodeInfo ||
		!configWithNodeInfo.config ||
		(typeof configWithNodeInfo.config?.visible !== 'undefined' &&
			!configWithNodeInfo.config?.visible)
	) {
		return null;
	}

	if (
		userIntentState?.currentUserIntent === 'dragging' ||
		(userIntentState?.currentUserIntent === 'blockMenuOpen' &&
			expValEquals('platform_editor_block_menu', 'isEnabled', true) &&
			fg('platform_editor_block_menu_hide_floating_toolbar'))
	) {
		return null;
	}

	// TODO: ED-27539 - This feature is unreleased and rendering logic needs to be move userIntentState which is not ready yet
	// if (blockControlsState?.isMenuOpen && editorExperiment('platform_editor_controls', 'variant1')) {
	// 	return null;
	// }

	const { config, node } = configWithNodeInfo;

	// When the new inline editor-toolbar is enabled, suppress floating toolbar for text selections.
	if (
		Boolean(pluginInjectionApi?.toolbar) &&
		editorExperiment('platform_editor_toolbar_aifc', true)
	) {
		const selection = editorView.state.selection as Selection;
		const isCellSelection = '$anchorCell' in selection && !selection.empty;
		const isTextSelected = selection instanceof TextSelection && !selection.empty;
		if ((isTextSelected && config.className !== 'hyperlink-floating-toolbar') || isCellSelection) {
			return null;
		}
	}

	let { items } = config;
	const { groupLabel } = config;
	const {
		title,
		getDomRef = getDomRefFromSelection,
		align = 'center',
		className = '',
		height,
		width,
		zIndex,
		offset = [0, 12],
		forcePlacement,
		preventPopupOverflow,
		onPositionCalculated,
		absoluteOffset = { top: 0, left: 0, right: 0, bottom: 0 },
		focusTrap,
		mediaAssistiveMessage = '',
		stick = true,
	} = config;
	const targetRef = getDomRef(editorView, dispatchAnalyticsEvent);

	const isEditorDisabled = editorDisabledState && editorDisabledState.editorDisabled;
	const isInViewMode = editorViewModeState?.mode === 'view';
	if (!targetRef || (isEditorDisabled && !isInViewMode)) {
		return null;
	}

	// TODO: MODES-3950 - Update this view mode specific logic once we refactor view mode.
	//       We should inverse the responsibility here: A blacklist for toolbar items in view mode, rather than this white list.
	//       Also consider moving this logic to the more specific toolbar plugins (media and selection).
	const iterableItems = Array.isArray(items) ? items : items?.(node);
	if (isInViewMode) {
		// Typescript note: Not all toolbar item types have the `supportsViewMode` prop.
		const toolbarItemViewModeProp: keyof FloatingToolbarButton<Command> = 'supportsViewMode';
		items = iterableItems.filter(
			(item) => toolbarItemViewModeProp in item && !!item[toolbarItemViewModeProp],
		);
	}

	if (areToolbarFlagsEnabled(Boolean(pluginInjectionApi?.toolbar))) {
		// Consolidate floating toolbar items
		const toolbarItemsArray = Array.isArray(items) ? items : items?.(node);
		const overflowDropdownItems = toolbarItemsArray.filter(
			(item) => item.type === 'overflow-dropdown',
		) as FloatingToolbarOverflowDropdown<Command>[];

		if (overflowDropdownItems.length > 1) {
			const consolidatedOverflowDropdown = consolidateOverflowDropdownItems(overflowDropdownItems);
			const otherItems = toolbarItemsArray.filter((item) => item.type !== 'overflow-dropdown');

			if (otherItems.length > 0) {
				// remove the last separators
				while (otherItems.at(-1)?.type === 'separator') {
					otherItems.pop();
				}
			}

			items = [
				...otherItems,
				{ type: 'separator', fullHeight: true, supportsViewMode: true },
				consolidatedOverflowDropdown,
			];
		}

		// Apply analytics to dropdown
		if (overflowDropdownItems.length > 0 && dispatchAnalyticsEvent) {
			const currentItems = Array.isArray(items) ? items : items?.(node);
			const updatedItems = currentItems.map((item) => {
				if (item.type !== 'overflow-dropdown') {
					return item;
				}
				const originalOnClick = item.onClick;
				return {
					...item,
					onClick: () => {
						const editorContentMode =
							pluginInjectionApi?.editorViewMode?.sharedState.currentState()?.mode;
						dispatchAnalyticsEvent({
							action: ACTION.CLICKED,
							actionSubject: ACTION_SUBJECT.BUTTON,
							actionSubjectId: ACTION_SUBJECT_ID.FLOATING_TOOLBAR_OVERFLOW,
							eventType: EVENT_TYPE.UI,
							attributes: {
								editorContentMode,
							},
						});
						// Call original onClick if it exists
						originalOnClick?.();
					},
				};
			});
			items = updatedItems;
		}
	}

	let customPositionCalculation;
	const toolbarItems = pluginInjectionApi?.copyButton?.actions.processCopyButtonItems(
		editorView.state,
	)(
		Array.isArray(items) ? items : items(node),
		pluginInjectionApi?.decorations?.actions.hoverDecoration,
	);

	if (onPositionCalculated) {
		customPositionCalculation = (nextPos: Position): Position => {
			return onPositionCalculated(editorView, nextPos);
		};
	}

	const dispatchCommand = (fn?: Function) =>
		fn && fn(editorView.state, editorView.dispatch, editorView);

	// Confirm dialog
	const { confirmDialogForItem } = floatingToolbarData || {};
	const confirmButtonItem = confirmDialogForItem
		? // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			(toolbarItems![confirmDialogForItem] as FloatingToolbarButton<Function>)
		: undefined;

	const scrollable = config.scrollable;

	const confirmDialogOptions =
		typeof confirmButtonItem?.confirmDialog === 'function'
			? confirmButtonItem?.confirmDialog()
			: confirmButtonItem?.confirmDialog;

	return (
		<ErrorBoundary
			component={ACTION_SUBJECT.FLOATING_TOOLBAR_PLUGIN}
			componentId={camelCase(title) as FLOATING_CONTROLS_TITLE}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			fallbackComponent={null}
		>
			<Popup
				ariaLabel={title}
				offset={offset}
				target={targetRef}
				alignY="bottom"
				forcePlacement={forcePlacement}
				fitHeight={height}
				fitWidth={width}
				absoluteOffset={absoluteOffset}
				alignX={align}
				stick={stick}
				zIndex={zIndex}
				mountTo={popupsMountPoint}
				boundariesElement={popupsBoundariesElement}
				scrollableElement={popupsScrollableElement}
				onPositionCalculated={customPositionCalculation}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={scrollable ? { maxWidth: '100%' } : {}}
				focusTrap={focusTrap}
				preventOverflow={preventPopupOverflow}
			>
				<WithProviders
					providerFactory={providerFactory}
					providers={['extensionProvider']}
					renderNode={(providers) => {
						return (
							<Toolbar
								target={targetRef}
								// Ignored via go/ees005
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
								items={toolbarItems!}
								groupLabel={groupLabel}
								node={node}
								dispatchCommand={dispatchCommand}
								editorView={editorView}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={className}
								focusEditor={() => editorView.focus()}
								providerFactory={providerFactory}
								popupsMountPoint={popupsMountPoint}
								popupsBoundariesElement={popupsBoundariesElement}
								popupsScrollableElement={popupsScrollableElement}
								dispatchAnalyticsEvent={dispatchAnalyticsEvent}
								extensionsProvider={providers.extensionProvider}
								scrollable={scrollable}
								api={pluginInjectionApi}
								mediaAssistiveMessage={mediaAssistiveMessage}
							/>
						);
					}}
				/>
			</Popup>

			<ConfirmationModal
				testId="ak-floating-toolbar-confirmation-modal"
				options={confirmDialogOptions}
				onConfirm={(isChecked = false) => {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					if (!!confirmDialogOptions!.onConfirm) {
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						dispatchCommand(confirmDialogOptions!.onConfirm(isChecked));
					} else {
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						dispatchCommand(confirmButtonItem!.onClick);
					}
				}}
				onClose={() => {
					dispatchCommand(hideConfirmDialog());
					// Need to set focus to Editor here,
					// As when the Confirmation dialog pop up, and user interacts with the dialog, Editor loses focus.
					// So when Confirmation dialog is closed, Editor does not have the focus, then cursor goes to the position 1 of the doc,
					// instead of the cursor position before the dialog pop up.
					if (!editorView.hasFocus()) {
						editorView.focus();
					}
				}}
			/>
		</ErrorBoundary>
	);
}

/**
 *
 * ProseMirror Plugin
 *
 */
// We throttle update of this plugin with RAF.
// So from other plugins you will always get the previous state.
export const pluginKey = new PluginKey<FloatingToolbarPluginState>('floatingToolbarPluginKey');

/**
 * Clean up floating toolbar configs from undesired properties.
 */
function sanitizeFloatingToolbarConfig(config: FloatingToolbarConfig): FloatingToolbarConfig {
	// Cleanup from non existing node types
	if (Array.isArray(config.nodeType)) {
		return {
			...config,
			nodeType: config.nodeType.filter(filterUndefined),
		};
	}

	return config;
}

/**
 * Creates a floating toolbar plugin for the ProseMirror editor.
 *
 * This factory function creates a SafePlugin that manages floating toolbars in the editor.
 * It processes an array of floating toolbar handlers and determines which toolbar configuration
 * should be active based on the current editor state and selection.
 *
 * @param options - Configuration object for the floating toolbar plugin
 * @param options.floatingToolbarHandlers - Array of handlers that return toolbar configurations
 * @param options.getIntl - Function that returns the IntlShape instance for internationalization
 * @param options.providerFactory - Factory for creating various providers used by the editor
 * @returns A SafePlugin instance that manages floating toolbar state and behavior
 */
export function floatingToolbarPluginFactory(options: {
	floatingToolbarHandlers: Array<FloatingToolbarHandler>;
	getIntl: () => IntlShape;
	providerFactory: ProviderFactory;
}) {
	const { floatingToolbarHandlers, providerFactory, getIntl } = options;
	const intl = getIntl();
	const getConfigWithNodeInfo = (editorState: EditorState) => {
		let activeConfigs: Array<FloatingToolbarConfig> | undefined = [];
		for (let index = 0; index < floatingToolbarHandlers.length; index++) {
			const handler = floatingToolbarHandlers[index];
			const config = handler(editorState, intl, providerFactory, activeConfigs);
			if (config) {
				if (
					config.__suppressAllToolbars &&
					editorExperiment('platform_editor_controls', 'variant1')
				) {
					activeConfigs = undefined;
					break;
				}
				activeConfigs.push(sanitizeFloatingToolbarConfig(config));
			}
		}

		const relevantConfig = activeConfigs && getRelevantConfig(editorState.selection, activeConfigs);
		return relevantConfig;
	};

	const apply = () => {
		const newPluginState: FloatingToolbarPluginState = {
			getConfigWithNodeInfo,
		};
		return newPluginState;
	};

	return new SafePlugin({
		key: pluginKey,
		state: {
			init: () => {
				return { getConfigWithNodeInfo };
			},
			apply,
		},
	});
}
