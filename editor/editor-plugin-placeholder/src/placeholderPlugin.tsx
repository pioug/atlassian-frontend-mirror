import type { IntlShape } from 'react-intl-next';

import type { DocNode } from '@atlaskit/adf-schema';
import { code, text } from '@atlaskit/adf-utils/builders';
import { placeholderTextMessages as messages } from '@atlaskit/editor-common/messages';
import { processRawValue } from '@atlaskit/editor-common/process-raw-value';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	bracketTyped,
	browser,
	hasDocAsParent,
	isEmptyDocument,
	isEmptyParagraph,
} from '@atlaskit/editor-common/utils';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import { Decoration, DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import type { PlaceholderPlugin } from './placeholderPluginType';

// Typewriter animation timing constants
const TYPEWRITER_TYPE_DELAY = 50; // Delay between typing each character
const TYPEWRITER_PAUSE_BEFORE_ERASE = 2000; // Pause before starting to erase text
const TYPEWRITER_ERASE_DELAY = 40; // Delay between erasing each character
const TYPEWRITER_CYCLE_DELAY = 500; // Delay before starting next cycle
const TYPEWRITER_TYPED_AND_DELETED_DELAY = 1500; // Delay before starting animation after user typed and deleted

export const EMPTY_PARAGRAPH_TIMEOUT_DELAY = 2000; // Delay before showing placeholder on empty paragraph

export const pluginKey = new PluginKey('placeholderPlugin');
const placeholderTestId = 'placeholder-test-id';
interface PlaceHolderState {
	// if true, showOnEmptyParagraph will be true after setTimeout
	canShowOnEmptyParagraph?: boolean;
	contextPlaceholderADF?: DocNode;
	hasPlaceholder: boolean;
	isPlaceholderHidden?: boolean;
	placeholderPrompts?: string[];
	placeholderText?: string;
	pos?: number;
	showOnEmptyParagraph?: boolean;
	typedAndDeleted?: boolean;
	userHadTyped?: boolean;
}

function getPlaceholderState(editorState: EditorState): PlaceHolderState {
	return pluginKey.getState(editorState);
}

const nodeTypesWithLongPlaceholderText = ['expand', 'panel'];
const nodeTypesWithShortPlaceholderText = ['tableCell', 'tableHeader'];
const nodeTypesWithSyncBlockPlaceholderText = ['bodiedSyncBlock'];

const createShortEmptyNodePlaceholderADF = ({ formatMessage }: IntlShape): DocNode =>
	({
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					code(formatMessage(messages.shortEmptyNodePlaceholderADFSlashShortcut)),
					text(' '),
					text(formatMessage(messages.shortEmptyNodePlaceholderADFSuffix)),
				],
			},
		],
	}) as DocNode;

const createLongEmptyNodePlaceholderADF = ({ formatMessage }: IntlShape): DocNode =>
	({
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [
					text(formatMessage(messages.longEmptyNodePlaceholderADFPrefix)),
					text(' '),
					code(formatMessage(messages.longEmptyNodePlaceholderADFSlashShortcut)),
					text(' '),
					text(formatMessage(messages.longEmptyNodePlaceholderADFSuffix)),
				],
			},
		],
	}) as DocNode;

const cycleThroughPlaceholderPrompts = (
	placeholderPrompts: string[],
	activeTypewriterTimeouts: (() => void)[] | undefined,
	placeholderNodeWithText: HTMLElement,
	initialDelayWhenUserTypedAndDeleted: number = 0,
) => {
	let currentPromptIndex = 0;
	let displayedText = '';
	let animationTimeouts: (number | NodeJS.Timeout)[] = [];

	const clearAllTimeouts = () => {
		// @ts-ignore - Workaround for help-center local consumption

		animationTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
		animationTimeouts = [];
	};

	const scheduleTimeout = (callback: () => void, delay: number): number | NodeJS.Timeout => {
		const timeoutId = setTimeout(callback, delay);
		animationTimeouts.push(timeoutId);
		return timeoutId;
	};

	const startAnimationCycle = () => {
		const currentPrompt = placeholderPrompts[currentPromptIndex];

		let characterIndex = 0;
		const typeNextCharacter = () => {
			if (characterIndex < currentPrompt.length) {
				displayedText = currentPrompt.substring(0, characterIndex + 1);
				placeholderNodeWithText.textContent = displayedText;
				characterIndex++;
				scheduleTimeout(typeNextCharacter, TYPEWRITER_TYPE_DELAY);
			} else {
				scheduleTimeout(eraseLastCharacter, TYPEWRITER_PAUSE_BEFORE_ERASE);
			}
		};

		const eraseLastCharacter = () => {
			if (displayedText.length > 1) {
				displayedText = displayedText.substring(0, displayedText.length - 1);
				placeholderNodeWithText.textContent = displayedText;
				scheduleTimeout(eraseLastCharacter, TYPEWRITER_ERASE_DELAY);
			} else {
				displayedText = ' ';
				placeholderNodeWithText.textContent = displayedText;
				currentPromptIndex = (currentPromptIndex + 1) % placeholderPrompts.length;
				scheduleTimeout(startAnimationCycle, TYPEWRITER_CYCLE_DELAY);
			}
		};

		typeNextCharacter();
	};

	activeTypewriterTimeouts?.push(clearAllTimeouts);

	if (initialDelayWhenUserTypedAndDeleted > 0) {
		placeholderNodeWithText.textContent = ' ';
		scheduleTimeout(startAnimationCycle, initialDelayWhenUserTypedAndDeleted);
	} else {
		startAnimationCycle();
	}
};

export function createPlaceholderDecoration(
	editorState: EditorState,
	placeholderText: string,
	placeholderPrompts?: string[],
	activeTypewriterTimeouts?: (() => void)[],
	pos: number = 1,
	initialDelayWhenUserTypedAndDeleted: number = 0,
	placeholderADF?: DocNode,
): DecorationSet {
	const placeholderDecoration = document.createElement('span');
	let placeholderNodeWithText = placeholderDecoration;

	placeholderDecoration.setAttribute('data-testid', placeholderTestId);
	placeholderDecoration.className = 'placeholder-decoration';
	placeholderDecoration.setAttribute('aria-hidden', 'true');

	// PM sets contenteditable to false on Decorations so Firefox doesn't display the flashing cursor
	// So adding an extra span which will contain the placeholder text
	if (browser.gecko) {
		const placeholderNode = document.createElement('span');
		placeholderNode.setAttribute('contenteditable', 'true'); // explicitly overriding the default Decoration behaviour
		placeholderDecoration.appendChild(placeholderNode);
		placeholderNodeWithText = placeholderNode;
	}
	if (placeholderText) {
		placeholderNodeWithText.textContent = placeholderText || ' ';
	} else if (placeholderADF) {
		const serializer = DOMSerializer.fromSchema(editorState.schema);
		// Get a PMNode from docnode
		const docNode = processRawValue(editorState.schema, placeholderADF);
		if (docNode) {
			// Extract only the inline content from paragraphs, avoiding block-level elements
			// that can interfere with cursor rendering
			// @ts-ignore - Workaround for help-center local consumption

			docNode.children.forEach((node) => {
				// For paragraph nodes, serialize their content (inline elements) directly
				// without the wrapping <p> tag
				if (node.type.name === 'paragraph') {
					// @ts-ignore - Workaround for help-center local consumption

					node.content.forEach((inlineNode) => {
						const inlineDOM = serializer.serializeNode(inlineNode);
						placeholderNodeWithText.append(inlineDOM);
					});
				} else {
					// For non-paragraph nodes, serialize normally
					const nodeDOM = serializer.serializeNode(node);
					placeholderNodeWithText.append(nodeDOM);
				}
			});
			const markElements = placeholderNodeWithText.querySelectorAll(
				'[data-prosemirror-content-type="mark"]',
			);
			// @ts-ignore - Workaround for help-center local consumption

			markElements.forEach((markEl) => {
				if (markEl instanceof HTMLElement) {
					markEl.style.setProperty('color', token('color.text.subtlest'));
				}
			});
			// Ensure all child elements don't block pointer events or cursor
			const allElements = placeholderNodeWithText.querySelectorAll('*');
			// @ts-ignore - Workaround for help-center local consumption

			allElements.forEach((el) => {
				if (el instanceof HTMLElement) {
					el.style.pointerEvents = 'none';
					el.style.userSelect = 'none';
				}
			});
		}
	} else if (placeholderPrompts) {
		cycleThroughPlaceholderPrompts(
			placeholderPrompts,
			activeTypewriterTimeouts,
			placeholderNodeWithText,
			initialDelayWhenUserTypedAndDeleted,
		);
	}

	// ME-2289 Tapping on backspace in empty editor hides and displays the keyboard
	// Add a editable buff node as the cursor moving forward is inevitable
	// when backspace in GBoard composition
	if (browser.android && browser.chrome) {
		const buffNode = document.createElement('span');
		buffNode.setAttribute('class', 'placeholder-android');
		buffNode.setAttribute('contenteditable', 'true');
		buffNode.textContent = ' ';
		placeholderDecoration.appendChild(buffNode);
	}

	const isTargetNested = editorState.doc.resolve(pos).depth > 1;

	// only truncate text for nested nodes, otherwise applying 'overflow: hidden;' to top level nodes
	// creates issues with quick insert button
	if (isTargetNested && editorExperiment('platform_editor_controls', 'variant1')) {
		placeholderDecoration.classList.add('placeholder-decoration-hide-overflow');
	}

	return DecorationSet.create(editorState.doc, [
		Decoration.widget(pos, placeholderDecoration, {
			side: 0,
			key: `placeholder ${placeholderText}`,
		}),
	]);
}

function setPlaceHolderState({
	placeholderText,
	pos,
	placeholderPrompts,
	typedAndDeleted,
	userHadTyped,
	canShowOnEmptyParagraph,
	showOnEmptyParagraph,
	contextPlaceholderADF,
}: {
	canShowOnEmptyParagraph?: boolean;
	contextPlaceholderADF?: DocNode;
	placeholderPrompts?: string[];
	placeholderText?: string;
	pos?: number;
	showOnEmptyParagraph?: boolean;
	typedAndDeleted?: boolean;
	userHadTyped?: boolean;
}): PlaceHolderState {
	return {
		hasPlaceholder: true,
		placeholderText,
		placeholderPrompts,
		contextPlaceholderADF,
		pos: pos ? pos : 1,
		typedAndDeleted,
		userHadTyped,
		canShowOnEmptyParagraph,
		showOnEmptyParagraph,
	};
}

const emptyPlaceholder = ({
	placeholderText,
	placeholderPrompts,
	userHadTyped,
	pos,
	canShowOnEmptyParagraph,
	showOnEmptyParagraph,
}: {
	canShowOnEmptyParagraph?: boolean;
	placeholderPrompts?: string[];
	placeholderText: string | undefined;
	pos?: number;
	showOnEmptyParagraph?: boolean;
	userHadTyped?: boolean;
}): PlaceHolderState => ({
	hasPlaceholder: false,
	placeholderText,
	placeholderPrompts,
	userHadTyped,
	typedAndDeleted: false,
	canShowOnEmptyParagraph,
	showOnEmptyParagraph,
	pos,
});

type CreatePlaceholderStateProps = {
	bracketPlaceholderText?: string;
	defaultPlaceholderText: string | undefined;
	editorState: EditorState;
	emptyLinePlaceholder?: string;
	intl: IntlShape;
	isEditorFocused: boolean;
	isInitial?: boolean;
	isPlaceholderHidden?: boolean;
	isTypeAheadOpen: ((editorState: EditorState) => boolean) | undefined;
	placeholderADF?: DocNode;
	placeholderPrompts?: string[];
	showOnEmptyParagraph?: boolean;
	typedAndDeleted?: boolean;
	userHadTyped?: boolean;
	withEmptyParagraph?: boolean;
};

function createPlaceHolderStateFrom({
	isInitial,
	isEditorFocused,
	editorState,
	isTypeAheadOpen,
	defaultPlaceholderText,
	intl,
	bracketPlaceholderText,
	emptyLinePlaceholder,
	placeholderADF,
	placeholderPrompts,
	typedAndDeleted,
	userHadTyped,
	isPlaceholderHidden,
	withEmptyParagraph,
	showOnEmptyParagraph,
}: CreatePlaceholderStateProps): PlaceHolderState {
	if (isPlaceholderHidden && fg('platform_editor_ai_aifc_patch_beta')) {
		return {
			...emptyPlaceholder({
				placeholderText: defaultPlaceholderText,
				placeholderPrompts,
				userHadTyped,
			}),
			isPlaceholderHidden,
		};
	}

	if (isTypeAheadOpen?.(editorState)) {
		return emptyPlaceholder({
			placeholderText: defaultPlaceholderText,
			placeholderPrompts,
			userHadTyped,
		});
	}

	if (
		(defaultPlaceholderText || placeholderPrompts || placeholderADF) &&
		isEmptyDocument(editorState.doc)
	) {
		return setPlaceHolderState({
			placeholderText: defaultPlaceholderText,
			pos: 1,
			placeholderPrompts,
			typedAndDeleted,
			userHadTyped,
		});
	}

	if (fg('platform_editor_ai_aifc_patch_beta_2') || fg('platform_editor_ai_aifc_patch_ga')) {
		const { from, to, $to } = editorState.selection;
		if (
			(defaultPlaceholderText || placeholderADF) &&
			withEmptyParagraph &&
			isEditorFocused &&
			!isInitial &&
			!isEmptyDocument(editorState.doc) &&
			from === to &&
			isEmptyParagraph($to.parent) &&
			hasDocAsParent($to)
		) {
			return showOnEmptyParagraph
				? setPlaceHolderState({
						placeholderText: defaultPlaceholderText,
						pos: to,
						placeholderPrompts,
						typedAndDeleted,
						userHadTyped,
						canShowOnEmptyParagraph: true,
						showOnEmptyParagraph: true,
					})
				: emptyPlaceholder({
						placeholderText: defaultPlaceholderText,
						placeholderPrompts,
						userHadTyped,
						canShowOnEmptyParagraph: true,
						showOnEmptyParagraph: false,
						pos: to,
					});
		}
	}

	if (isEditorFocused && editorExperiment('platform_editor_controls', 'variant1')) {
		const { $from, $to } = editorState.selection;

		if ($from.pos !== $to.pos) {
			return emptyPlaceholder({
				placeholderText: defaultPlaceholderText,
				placeholderPrompts,
				userHadTyped,
			});
		}

		const parentNode = $from.node($from.depth - 1);
		const parentType = parentNode?.type.name;

		if (emptyLinePlaceholder && parentType === 'doc') {
			const isEmptyLine = isEmptyParagraph($from.parent);
			if (isEmptyLine) {
				return setPlaceHolderState({
					placeholderText: emptyLinePlaceholder,
					pos: $from.pos,
					placeholderPrompts,
					typedAndDeleted,
					userHadTyped,
				});
			}
		}

		const isEmptyNode =
			parentNode?.childCount === 1 &&
			parentNode.firstChild?.content.size === 0 &&
			parentNode.firstChild?.type.name === 'paragraph';

		if (nodeTypesWithShortPlaceholderText.includes(parentType) && isEmptyNode) {
			const table = findParentNode((node) => node.type === editorState.schema.nodes.table)(
				editorState.selection,
			);

			if (!table) {
				return emptyPlaceholder({
					placeholderText: defaultPlaceholderText,
					placeholderPrompts,
					userHadTyped,
				});
			}

			const isFirstCell = table?.node.firstChild?.content.firstChild === parentNode;
			if (isFirstCell) {
				return setPlaceHolderState({
					placeholderText: !fg('platform_editor_ai_aifc_patch_ga')
						? intl.formatMessage(messages.shortEmptyNodePlaceholderText)
						: undefined,
					contextPlaceholderADF: fg('platform_editor_ai_aifc_patch_ga')
						? createShortEmptyNodePlaceholderADF(intl)
						: undefined,
					pos: $from.pos,
					placeholderPrompts,
					typedAndDeleted,
					userHadTyped,
				});
			}
		}

		if (nodeTypesWithLongPlaceholderText.includes(parentType) && isEmptyNode) {
			return setPlaceHolderState({
				placeholderText: !fg('platform_editor_ai_aifc_patch_ga')
					? intl.formatMessage(messages.longEmptyNodePlaceholderText)
					: undefined,
				contextPlaceholderADF: fg('platform_editor_ai_aifc_patch_ga')
					? createLongEmptyNodePlaceholderADF(intl)
					: undefined,
				pos: $from.pos,
				placeholderPrompts,
				typedAndDeleted,
				userHadTyped,
			});
		}

		if (
			nodeTypesWithSyncBlockPlaceholderText.includes(parentType) &&
			isEmptyNode &&
			editorExperiment('platform_synced_block', true)
		) {
			return setPlaceHolderState({
				placeholderText: intl.formatMessage(messages.syncBlockPlaceholderText),
				pos: $from.pos,
				placeholderPrompts,
				typedAndDeleted,
				userHadTyped,
			});
		}

		return emptyPlaceholder({
			placeholderText: defaultPlaceholderText,
			placeholderPrompts,
			userHadTyped,
		});
	}

	if (bracketPlaceholderText && bracketTyped(editorState) && isEditorFocused) {
		const { $from } = editorState.selection;
		// Space is to account for positioning of the bracket
		const bracketHint = '  ' + bracketPlaceholderText;
		return setPlaceHolderState({
			placeholderText: bracketHint,
			pos: $from.pos - 1,
			placeholderPrompts,
			typedAndDeleted,
			userHadTyped,
		});
	}

	return emptyPlaceholder({
		placeholderText: defaultPlaceholderText,
		placeholderPrompts,
		userHadTyped,
	});
}

type UserInteractionState = {
	newEditorState: EditorState;
	oldEditorState?: EditorState;
	placeholderState?: PlaceHolderState;
};

function calculateUserInteractionState({
	placeholderState,
	oldEditorState,
	newEditorState,
}: UserInteractionState): { typedAndDeleted: boolean; userHadTyped: boolean } {
	const wasEmpty = oldEditorState ? isEmptyDocument(oldEditorState.doc) : true;
	const isEmpty = isEmptyDocument(newEditorState.doc);
	const hasEverTyped =
		Boolean(placeholderState?.userHadTyped) || // Previously typed
		!wasEmpty || // Had content before
		(wasEmpty && !isEmpty); // Just added content
	const justDeletedAll = hasEverTyped && isEmpty && !wasEmpty;
	const isInTypedAndDeletedState =
		justDeletedAll || (Boolean(placeholderState?.typedAndDeleted) && isEmpty);
	// Only reset user interaction tracking when editor is cleanly empty
	const shouldResetInteraction = isEmpty && !isInTypedAndDeletedState;

	return {
		userHadTyped: shouldResetInteraction ? false : hasEverTyped,
		typedAndDeleted: isInTypedAndDeletedState,
	};
}

export function createPlugin(
	intl: IntlShape,
	defaultPlaceholderText?: string,
	bracketPlaceholderText?: string,
	emptyLinePlaceholder?: string,
	placeholderPrompts?: string[],
	withEmptyParagraph?: boolean,
	placeholderADF?: DocNode,
	api?: ExtractInjectionAPI<PlaceholderPlugin>,
): SafePlugin | undefined {
	if (
		!defaultPlaceholderText &&
		!placeholderPrompts &&
		!bracketPlaceholderText &&
		!placeholderADF
	) {
		return;
	}

	let isDestroyed = false;
	let activeTypewriterTimeouts: (() => void)[] = [];
	const clearAllTypewriterTimeouts = () => {
		// @ts-ignore - Workaround for help-center local consumption

		activeTypewriterTimeouts.forEach((clearFn) => clearFn());
		activeTypewriterTimeouts = [];
	};

	return new SafePlugin<PlaceHolderState>({
		key: pluginKey,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init: (_, state) =>
				createPlaceHolderStateFrom({
					isInitial: true,
					isEditorFocused: Boolean(api?.focus?.sharedState.currentState()?.hasFocus),
					editorState: state,
					isTypeAheadOpen: api?.typeAhead?.actions.isOpen,
					defaultPlaceholderText,
					bracketPlaceholderText,
					emptyLinePlaceholder,
					placeholderADF,
					placeholderPrompts,
					typedAndDeleted: false,
					userHadTyped: false,
					intl,
				}),
			// @ts-ignore - Workaround for help-center local consumption

			apply: (tr, placeholderState, _oldEditorState, newEditorState) => {
				const meta = tr.getMeta(pluginKey);
				const isEditorFocused = Boolean(api?.focus?.sharedState.currentState()?.hasFocus);

				const { userHadTyped, typedAndDeleted } = calculateUserInteractionState({
					placeholderState,
					oldEditorState: _oldEditorState,
					newEditorState,
				});

				let isPlaceholderHidden = placeholderState?.isPlaceholderHidden ?? false;
				if (meta?.isPlaceholderHidden !== undefined && fg('platform_editor_ai_aifc_patch_beta')) {
					isPlaceholderHidden = meta.isPlaceholderHidden;
				}

				if (
					meta?.placeholderText !== undefined &&
					(fg('platform_editor_ai_aifc_patch_beta_2') || fg('platform_editor_ai_aifc_patch_ga'))
				) {
					// Only update defaultPlaceholderText from meta if we're not using ADF placeholder
					if (!(fg('platform_editor_ai_aifc_patch_ga') && placeholderADF)) {
						defaultPlaceholderText = meta.placeholderText;
					}
				}

				const newPlaceholderState = createPlaceHolderStateFrom({
					isEditorFocused,
					editorState: newEditorState,
					isTypeAheadOpen: api?.typeAhead?.actions.isOpen,
					defaultPlaceholderText:
						fg('platform_editor_ai_aifc_patch_beta_2') || fg('platform_editor_ai_aifc_patch_ga')
							? defaultPlaceholderText
							: (meta?.placeholderText ??
								placeholderState?.placeholderText ??
								defaultPlaceholderText),
					bracketPlaceholderText,
					emptyLinePlaceholder,
					placeholderADF,
					placeholderPrompts:
						meta?.placeholderPrompts ?? placeholderState?.placeholderPrompts ?? placeholderPrompts,
					typedAndDeleted,
					userHadTyped,
					intl,
					isPlaceholderHidden,
					withEmptyParagraph,
					showOnEmptyParagraph:
						meta?.showOnEmptyParagraph ?? placeholderState?.showOnEmptyParagraph,
				});

				// Clear timeouts when hasPlaceholder becomes false
				if (!newPlaceholderState.hasPlaceholder) {
					clearAllTypewriterTimeouts();
				}

				return newPlaceholderState;
			},
		},
		props: {
			// @ts-ignore - Workaround for help-center local consumption

			decorations(editorState): DecorationSet | undefined {
				const { hasPlaceholder, placeholderText, pos, typedAndDeleted, contextPlaceholderADF } =
					getPlaceholderState(editorState);

				// Decorations is still called after plugin is destroyed
				// So we need to make sure decorations is not called if plugin has been destroyed to prevent the placeholder animations' setTimeouts called infinitely
				if (isDestroyed) {
					return;
				}

				const compositionPluginState = api?.composition?.sharedState.currentState();
				const isShowingDiff = Boolean(
					api?.showDiff?.sharedState.currentState()?.isDisplayingChanges,
				);

				if (
					hasPlaceholder &&
					((placeholderText ?? '') ||
						placeholderPrompts ||
						placeholderADF ||
						contextPlaceholderADF) &&
					pos !== undefined &&
					!compositionPluginState?.isComposing &&
					!isShowingDiff
				) {
					const initialDelayWhenUserTypedAndDeleted = typedAndDeleted
						? TYPEWRITER_TYPED_AND_DELETED_DELAY
						: 0;
					// contextPlaceholderADF takes precedence over the global placeholderADF
					const placeholderAdfToUse = contextPlaceholderADF || placeholderADF;
					return createPlaceholderDecoration(
						editorState,
						placeholderText ?? '',
						placeholderPrompts,
						activeTypewriterTimeouts,
						pos,
						initialDelayWhenUserTypedAndDeleted,
						placeholderAdfToUse,
					);
				}
				return;
			},
		},
		// @ts-ignore - Workaround for help-center local consumption

		view() {
			let timeoutId: ReturnType<typeof setTimeout> | undefined;

			function startEmptyParagraphTimeout(editorView: EditorView) {
				if (timeoutId) {
					return;
				}
				timeoutId = setTimeout(() => {
					timeoutId = undefined;
					editorView.dispatch(
						editorView.state.tr.setMeta(pluginKey, {
							showOnEmptyParagraph: true,
						}),
					);
				}, EMPTY_PARAGRAPH_TIMEOUT_DELAY);
			}

			function destroyEmptyParagraphTimeout() {
				if (timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = undefined;
				}
			}

			return {
				// @ts-ignore - Workaround for help-center local consumption

				update(editorView, prevState) {
					if (
						fg('platform_editor_ai_aifc_patch_beta_2') ||
						fg('platform_editor_ai_aifc_patch_ga')
					) {
						const prevPluginState = getPlaceholderState(prevState);
						const newPluginState = getPlaceholderState(editorView.state);

						// user start typing after move to an empty paragraph, clear timeout
						if (!newPluginState.canShowOnEmptyParagraph && timeoutId) {
							destroyEmptyParagraphTimeout();
						}
						// user move to an empty paragraph again, reset state to hide placeholder, and restart timeout
						else if (
							prevPluginState.canShowOnEmptyParagraph &&
							newPluginState.canShowOnEmptyParagraph &&
							newPluginState.pos !== prevPluginState.pos
						) {
							editorView.dispatch(
								editorView.state.tr.setMeta(pluginKey, {
									showOnEmptyParagraph: false,
								}),
							);
							destroyEmptyParagraphTimeout();
							startEmptyParagraphTimeout(editorView);
						}
						// user move to an empty paragraph (by click enter or move to an empty paragraph), start timeout
						else if (
							!prevPluginState.canShowOnEmptyParagraph &&
							newPluginState.canShowOnEmptyParagraph &&
							!newPluginState.showOnEmptyParagraph &&
							!timeoutId
						) {
							startEmptyParagraphTimeout(editorView);
						}
					}
				},
				// @ts-ignore - Workaround for help-center local consumption

				destroy() {
					clearAllTypewriterTimeouts();

					destroyEmptyParagraphTimeout();

					isDestroyed = true;
				},
			};
		},
	});
}

export const placeholderPlugin: PlaceholderPlugin = ({ config: options, api }) => {
	let currentPlaceholder = options?.placeholder;

	return {
		name: 'placeholder',

		commands: {
			setPlaceholder:
				(placeholderText: string) =>
				({ tr }) => {
					if (currentPlaceholder !== placeholderText) {
						currentPlaceholder = placeholderText;
						return tr.setMeta(pluginKey, { placeholderText: placeholderText });
					}
					return null;
				},
			setAnimatingPlaceholderPrompts:
				(placeholderPrompts: string[] | null) =>
				({ tr }) => {
					return tr.setMeta(pluginKey, { placeholderPrompts: placeholderPrompts });
				},
			setPlaceholderHidden:
				(isPlaceholderHidden: boolean) =>
				({ tr }) => {
					return tr.setMeta(pluginKey, { isPlaceholderHidden });
				},
		},

		pmPlugins() {
			return [
				{
					name: 'placeholder',
					plugin: ({ getIntl }) =>
						createPlugin(
							getIntl(),
							options && options.placeholder,
							options && options.placeholderBracketHint,
							options && options.emptyLinePlaceholder,
							options && options.placeholderPrompts,
							options?.withEmptyParagraph,
							options && options.placeholderADF,
							api,
						),
				},
			];
		},
	};
};
