import type { Dispatch, EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type {
	Extension,
	ExtensionHandler,
	ExtensionHandlers,
	ExtensionProvider,
	UpdateExtension,
} from '@atlaskit/editor-common/extensions';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
	createSelectionClickHandler,
	GapCursorSelection,
	isSelectionAtEndOfNode,
	isSelectionAtStartOfNode,
} from '@atlaskit/editor-common/selection';
import type {
	EditorAppearance,
	ExtractInjectionAPI,
	FeatureFlags,
} from '@atlaskit/editor-common/types';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfTypeClosestToPos,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { clearEditingContext, updateState } from '../editor-commands/commands';
import type { ExtensionPlugin, ExtensionPluginOptions } from '../extensionPluginType';
import { lazyExtensionNodeView } from '../nodeviews/lazyExtension';

import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { updateEditButton } from './update-edit-button';
import { getSelectedDomElement, getSelectedExtension } from './utils';

const shouldShowEditButton = (
	extensionHandler?: Extension | ExtensionHandler,
	extensionProvider?: ExtensionProvider,
) => {
	const usesLegacyMacroBrowser =
		(!extensionHandler && !extensionProvider) || typeof extensionHandler === 'function';

	const usesModernUpdateMethod =
		typeof extensionHandler === 'object' && typeof extensionHandler.update === 'function';

	if (usesLegacyMacroBrowser || usesModernUpdateMethod) {
		return true;
	}

	return false;
};

const getUpdateExtensionPromise = async (
	view: EditorView,
	extensionHandler?: Extension | ExtensionHandler,
	extensionProvider?: ExtensionProvider,
): Promise<UpdateExtension | void> => {
	if (extensionHandler && typeof extensionHandler === 'object') {
		// Old API with the `update` function
		return extensionHandler.update;
	} else if (extensionProvider) {
		// New API with or without the `update` function, we don't know at this point
		const updateMethod = await updateEditButton(view, extensionProvider);
		if (updateMethod) {
			return updateMethod;
		}
	}

	throw new Error('No update method available');
};

export const createExtensionProviderHandler =
	(view: EditorView) => async (name: string, provider?: Promise<ExtensionProvider>) => {
		if (name === 'extensionProvider' && provider) {
			try {
				const extensionProvider = await provider;
				updateState({ extensionProvider })(view.state, view.dispatch);
				await updateEditButton(view, extensionProvider);
			} catch {
				updateState({ extensionProvider: undefined })(view.state, view.dispatch);
			}
		}
	};

export const handleUpdate = ({
	view,
	prevState,
	domAtPos,
	extensionHandlers,
	applyChange,
}: {
	view: EditorView;
	prevState: EditorState;
	domAtPos: EditorView['domAtPos'];
	extensionHandlers: ExtensionHandlers;
	applyChange: ApplyChangeHandler | undefined;
}) => {
	const { state, dispatch } = view;
	const { element, localId, extensionProvider, showContextPanel, showEditButton } =
		getPluginState(state);

	// This fetches the selected extension node, either by keyboard selection or click for all types of extensions
	const selectedExtension = getSelectedExtension(state, true);

	if (!selectedExtension) {
		if (showContextPanel) {
			clearEditingContext(applyChange)(state, dispatch);
		}
		return;
	}

	const { node } = selectedExtension;

	const newElement = getSelectedDomElement(state.schema, domAtPos, selectedExtension);

	// In some cases, showEditButton can be stale and the edit button doesn't show - @see ED-15285
	// To be safe, we update the showEditButton state here
	const shouldUpdateEditButton =
		!showEditButton &&
		extensionProvider &&
		element === newElement &&
		!getSelectedExtension(prevState, true);

	const isNewNodeSelected = node.attrs.localId
		? localId !== node.attrs.localId
		: // This is the current assumption and it's wrong but we are keeping it
			// as fallback in case we need to turn off `allowLocalIdGeneration`
			element !== newElement;

	if (isNewNodeSelected || shouldUpdateEditButton) {
		if (showContextPanel) {
			clearEditingContext(applyChange)(state, dispatch);
			return;
		}

		const { extensionType } = node.attrs;
		const extensionHandler = extensionHandlers[extensionType];

		// showEditButton might change async based on results from extension providers
		const showEditButton = shouldShowEditButton(extensionHandler, extensionProvider);

		const updateExtension = getUpdateExtensionPromise(
			view,
			extensionHandler,
			extensionProvider,
		).catch(() => {
			// do nothing;
		});

		updateState({
			localId: node.attrs.localId,
			showContextPanel: false,
			element: newElement,
			showEditButton,
			updateExtension,
		})(state, dispatch);
	}
	// New DOM element doesn't necessarily mean it's a new Node
	else if (element !== newElement) {
		updateState({ element: newElement })(state, dispatch);
	}

	return true;
};

export const createPlugin = (
	dispatch: Dispatch,
	providerFactory: ProviderFactory,
	extensionHandlers: ExtensionHandlers,
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	pluginInjectionApi: ExtractInjectionAPI<ExtensionPlugin> | undefined,
	useLongPressSelection: boolean = false,
	options: {
		appearance?: EditorAppearance;
	} = {},
	featureFlags?: FeatureFlags,
	allowDragAndDrop: boolean = true,
	__rendererExtensionOptions?: ExtensionPluginOptions['__rendererExtensionOptions'],
) => {
	const state = createPluginState(dispatch, {
		showEditButton: false,
		showContextPanel: false,
	});

	const extensionNodeViewOptions = {
		appearance: options.appearance,
	};

	const macroInteractionDesignFeatureFlags = {
		showMacroInteractionDesignUpdates: featureFlags?.macroInteractionUpdates ?? false,
	};
	const showLivePagesBodiedMacrosRendererView =
		__rendererExtensionOptions?.isAllowedToUseRendererView;

	return new SafePlugin({
		state,
		view: (editorView) => {
			const domAtPos = editorView.domAtPos.bind(editorView);
			const extensionProviderHandler = createExtensionProviderHandler(editorView);

			providerFactory.subscribe('extensionProvider', extensionProviderHandler);

			return {
				update: (view, prevState) => {
					handleUpdate({
						view,
						prevState,
						domAtPos,
						extensionHandlers,
						applyChange: pluginInjectionApi?.contextPanel?.actions.applyChange,
					});
				},
				destroy: () => {
					providerFactory.unsubscribe('extensionProvider', extensionProviderHandler);
				},
			};
		},
		key: pluginKey,
		props: {
			handleDOMEvents: {
				/**
				 * ED-18072 - Cannot shift + arrow past bodied extension if it is not empty.
				 * This code is to handle the case where the selection starts inside or on the node and the user is trying to shift + arrow.
				 * For other part of the solution see code in: packages/editor/editor-core/src/plugins/selection/pm-plugins/events/keydown.ts
				 */
				keydown: (view, event) => {
					if (
						event instanceof KeyboardEvent &&
						event.shiftKey &&
						['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
					) {
						const {
							schema,
							selection,
							selection: { $head },
							doc,
							tr,
						} = view.state;
						const { bodiedExtension } = schema.nodes;

						if (selection instanceof TextSelection || selection instanceof NodeSelection) {
							const maybeBodiedExtension =
								selection instanceof TextSelection
									? findParentNodeOfTypeClosestToPos($head, bodiedExtension)
									: findSelectedNodeOfType(bodiedExtension)(selection);

							if (maybeBodiedExtension) {
								const end = maybeBodiedExtension.pos + maybeBodiedExtension.node.nodeSize;

								if (
									event.key === 'ArrowUp' ||
									(event.key === 'ArrowLeft' &&
										isSelectionAtStartOfNode($head, maybeBodiedExtension))
								) {
									const anchor = end + 1;

									// an offset is used here so that left arrow selects the first character before the node (consistent with arrow right)
									const headOffset = event.key === 'ArrowLeft' ? -1 : 0;
									const head = maybeBodiedExtension.pos + headOffset;

									const newSelection = TextSelection.create(
										doc,
										Math.max(anchor, selection.anchor),
										head,
									);
									view.dispatch(tr.setSelection(newSelection));
									return true;
								}

								if (
									event.key === 'ArrowDown' ||
									(event.key === 'ArrowRight' &&
										isSelectionAtEndOfNode($head, maybeBodiedExtension))
								) {
									const anchor = maybeBodiedExtension.pos - 1;
									const head = end + 1;

									const newSelection = TextSelection.create(
										doc,
										Math.min(anchor, selection.anchor),
										head,
									);
									view.dispatch(tr.setSelection(newSelection));
									return true;
								}
							}
						}
					}

					// Handle non shift key case for MBE
					if (event instanceof KeyboardEvent && !event.shiftKey && event.key === 'ArrowLeft') {
						const {
							schema,
							selection,
							selection: { $head },
							doc,
							tr,
						} = view.state;
						const { multiBodiedExtension, extensionFrame, paragraph } = schema.nodes;
						if (
							selection instanceof GapCursorSelection ||
							(selection instanceof TextSelection && $head.parent.type === paragraph)
						) {
							const maybeMultiBodiedExtension = findParentNodeOfTypeClosestToPos(
								$head,
								multiBodiedExtension,
							);
							if (maybeMultiBodiedExtension) {
								/* In case of gap cursor, we need to decrement the position by 1 as we need to check the node at previous position
								 * In case of text selection, we need to decrement the position by 2 as we need to jump back twice, once from text node and then its parent paragraph node
								 */
								const previousPositionDecrement = selection instanceof GapCursorSelection ? 1 : 2;
								if (tr.doc.nodeAt($head.pos - previousPositionDecrement)?.type === extensionFrame) {
									const newSelection = TextSelection.create(
										doc,
										tr.doc
											.resolve($head.pos - previousPositionDecrement)
											.start($head.depth - previousPositionDecrement),
									);
									view.dispatch(tr.setSelection(newSelection));
								}
							}
						}
					}

					return false;
				},
			},
			nodeViews: {
				// WARNING: referentiality-plugin also creates these nodeviews
				extension: lazyExtensionNodeView(
					'extension',
					portalProviderAPI,
					eventDispatcher,
					providerFactory,
					extensionHandlers,
					extensionNodeViewOptions,
					pluginInjectionApi,
					macroInteractionDesignFeatureFlags,
				),
				// WARNING: referentiality-plugin also creates these nodeviews
				bodiedExtension: lazyExtensionNodeView(
					'bodiedExtension',
					portalProviderAPI,
					eventDispatcher,
					providerFactory,
					extensionHandlers,
					extensionNodeViewOptions,
					pluginInjectionApi,
					macroInteractionDesignFeatureFlags,
					showLivePagesBodiedMacrosRendererView,
					__rendererExtensionOptions?.showUpdated1PBodiedExtensionUI,
					__rendererExtensionOptions?.rendererExtensionHandlers,
				),
				// WARNING: referentiality-plugin also creates these nodeviews
				inlineExtension: lazyExtensionNodeView(
					'inlineExtension',
					portalProviderAPI,
					eventDispatcher,
					providerFactory,
					extensionHandlers,
					extensionNodeViewOptions,
					pluginInjectionApi,
					macroInteractionDesignFeatureFlags,
				),
				multiBodiedExtension: lazyExtensionNodeView(
					'multiBodiedExtension',
					portalProviderAPI,
					eventDispatcher,
					providerFactory,
					extensionHandlers,
					extensionNodeViewOptions,
					pluginInjectionApi,
					macroInteractionDesignFeatureFlags,
				),
			},
			createSelectionBetween: function (view, anchor, head) {
				const { schema, doc } = view.state;
				const { multiBodiedExtension } = schema.nodes;
				const isAnchorInMBE = findParentNodeOfTypeClosestToPos(anchor, multiBodiedExtension);
				const isHeadInMBE = findParentNodeOfTypeClosestToPos(head, multiBodiedExtension);
				if (isAnchorInMBE !== undefined && isHeadInMBE === undefined) {
					// Anchor is in MBE, where user started selecting within MBE and then moved outside
					const newSelection = TextSelection.create(
						doc,
						isAnchorInMBE.pos < head.pos
							? isAnchorInMBE.pos
							: isAnchorInMBE.pos + isAnchorInMBE.node.nodeSize, // isAnchorInMBE.pos < head.pos represents downwards selection
						head.pos,
					);
					return newSelection;
				}
				if (isAnchorInMBE === undefined && isHeadInMBE !== undefined) {
					// Head is in MBE, where user started selecting outside MBE and then moved inside
					const newSelection = TextSelection.create(
						doc,
						anchor.pos,
						isHeadInMBE.pos < anchor.pos
							? isHeadInMBE.pos
							: isHeadInMBE.pos + isHeadInMBE.node.nodeSize, // isHeadInMBE.pos < anchor.pos represents upwards selection
					);
					return newSelection;
				}
				return null;
			},
			handleClickOn: createSelectionClickHandler(
				['extension', 'bodiedExtension', 'multiBodiedExtension'],
				(target) =>
					fg('platform_editor_legacy_content_macro')
						? !target.closest('.extension-non-editable-area') &&
							(!target.closest('.extension-content') || !!target.closest('.extension-container'))
						: !target.closest('.extension-content'), // It's to enable nested extensions selection
				{ useLongPressSelection },
			),
			handleDrop(view, event, slice, moved) {
				if (fg('platform_editor_legacy_content_macro')) {
					if (!allowDragAndDrop) {
						// Completely disable DND for extension nodes when allowDragAndDrop is false
						const isExtension =
							slice.content.childCount === 1 &&
							slice.content.firstChild?.type === view.state.schema.nodes.extension;

						return isExtension;
					}
					return false;
				}
				return false;
			},
		},
	});
};
