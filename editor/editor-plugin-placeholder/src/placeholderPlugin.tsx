import type { IntlShape } from 'react-intl-next';

import { placeholderTextMessages as messages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	bracketTyped,
	browser,
	isEmptyDocument,
	isEmptyParagraph,
} from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { PlaceholderPlugin } from './placeholderPluginType';

// Typewriter animation timing constants
const TYPEWRITER_TYPE_DELAY = 50; // Delay between typing each character
const TYPEWRITER_PAUSE_BEFORE_ERASE = 2000; // Pause before starting to erase text
const TYPEWRITER_ERASE_DELAY = 40; // Delay between erasing each character
const TYPEWRITER_CYCLE_DELAY = 500; // Delay before starting next cycle

export const pluginKey = new PluginKey('placeholderPlugin');

interface PlaceHolderState {
	hasPlaceholder: boolean;
	placeholderText?: string;
	placeholderPrompts?: string[];
	pos?: number;
}

function getPlaceholderState(editorState: EditorState): PlaceHolderState {
	return pluginKey.getState(editorState);
}
export const placeholderTestId = 'placeholder-test-id';

const nodeTypesWithLongPlaceholderText = ['expand', 'panel'];
const nodeTypesWithShortPlaceholderText = ['tableCell', 'tableHeader'];

const createTypewriterElement = (
	placeholderPrompts: string[],
	activeTypewriterTimeouts: (() => void)[] | undefined,
): HTMLElement => {
	const typewriterElement = document.createElement('span');
	let currentPromptIndex = 0;
	let displayedText = '';
	let animationTimeouts: (number | NodeJS.Timeout)[] = [];

	const clearAllTimeouts = () => {
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
				typewriterElement.textContent = displayedText;
				characterIndex++;
				scheduleTimeout(typeNextCharacter, TYPEWRITER_TYPE_DELAY);
			} else {
				scheduleTimeout(eraseLastCharacter, TYPEWRITER_PAUSE_BEFORE_ERASE);
			}
		};

		const eraseLastCharacter = () => {
			if (displayedText.length > 0) {
				displayedText = displayedText.substring(0, displayedText.length - 1);
				typewriterElement.textContent = displayedText;
				scheduleTimeout(eraseLastCharacter, TYPEWRITER_ERASE_DELAY);
			} else {
				// Move to next prompt. Modulo lets us cycle infinitely
				currentPromptIndex = (currentPromptIndex + 1) % placeholderPrompts.length;
				scheduleTimeout(startAnimationCycle, TYPEWRITER_CYCLE_DELAY);
			}
		};

		typeNextCharacter();
	};

	activeTypewriterTimeouts?.push(clearAllTimeouts);

	startAnimationCycle();
	return typewriterElement;
};

export function createPlaceholderDecoration(
	editorState: EditorState,
	placeholderText: string,
	placeholderPrompts?: string[],
	activeTypewriterTimeouts?: (() => void)[],
	pos: number = 1,
): DecorationSet {
	const placeholderDecoration = document.createElement('span');
	let placeholderNodeWithText = placeholderDecoration;
	let typewriterElement: HTMLElement | null = null;

	placeholderDecoration.setAttribute('data-testid', placeholderTestId);
	placeholderDecoration.className = 'placeholder-decoration';

	// PM sets contenteditable to false on Decorations so Firefox doesn't display the flashing cursor
	// So adding an extra span which will contain the placeholder text
	if (browser.gecko) {
		const placeholderNode = document.createElement('span');
		placeholderNode.setAttribute('contenteditable', 'true'); // explicitly overriding the default Decoration behaviour
		placeholderDecoration.appendChild(placeholderNode);
		placeholderNodeWithText = placeholderNode;
	}

	if (placeholderPrompts) {
		typewriterElement = createTypewriterElement(placeholderPrompts, activeTypewriterTimeouts);
		placeholderNodeWithText.appendChild(typewriterElement);
	} else {
		placeholderNodeWithText.textContent = placeholderText || ' ';
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

function setPlaceHolderState(
	placeholderText?: string,
	pos?: number,
	placeholderPrompts?: string[],
): PlaceHolderState {
	return {
		hasPlaceholder: true,
		placeholderText,
		placeholderPrompts,
		pos: pos ? pos : 1,
	};
}

const emptyPlaceholder = (
	placeholderText: string | undefined,
	placeholderPrompts?: string[],
): PlaceHolderState => ({
	hasPlaceholder: false,
	placeholderText,
	placeholderPrompts,
});

type CreatePlaceholderStateProps = {
	isEditorFocused: boolean;
	editorState: EditorState;
	isTypeAheadOpen: ((editorState: EditorState) => boolean) | undefined;
	defaultPlaceholderText: string | undefined;
	intl: IntlShape;
	bracketPlaceholderText?: string;
	emptyLinePlaceholder?: string;
	placeholderPrompts?: string[];
};

function createPlaceHolderStateFrom({
	isEditorFocused,
	editorState,
	isTypeAheadOpen,
	defaultPlaceholderText,
	intl,
	bracketPlaceholderText,
	emptyLinePlaceholder,
	placeholderPrompts,
}: CreatePlaceholderStateProps): PlaceHolderState {
	if (isTypeAheadOpen?.(editorState)) {
		return emptyPlaceholder(defaultPlaceholderText, placeholderPrompts);
	}
	if ((defaultPlaceholderText || placeholderPrompts) && isEmptyDocument(editorState.doc)) {
		return setPlaceHolderState(defaultPlaceholderText, 1, placeholderPrompts);
	}

	if (isEditorFocused && editorExperiment('platform_editor_controls', 'variant1')) {
		const { $from, $to } = editorState.selection;

		if ($from.pos !== $to.pos) {
			return emptyPlaceholder(defaultPlaceholderText, placeholderPrompts);
		}

		const parentNode = $from.node($from.depth - 1);
		const parentType = parentNode?.type.name;

		if (emptyLinePlaceholder && parentType === 'doc') {
			const isEmptyLine = isEmptyParagraph($from.parent);
			if (isEmptyLine) {
				return setPlaceHolderState(emptyLinePlaceholder, $from.pos);
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
				return emptyPlaceholder(defaultPlaceholderText, placeholderPrompts);
			}

			const isFirstCell = table?.node.firstChild?.content.firstChild === parentNode;
			if (isFirstCell) {
				return setPlaceHolderState(
					intl.formatMessage(messages.shortEmptyNodePlaceholderText),
					$from.pos,
				);
			}
		}

		if (nodeTypesWithLongPlaceholderText.includes(parentType) && isEmptyNode) {
			return setPlaceHolderState(
				intl.formatMessage(messages.longEmptyNodePlaceholderText),
				$from.pos,
			);
		}

		return emptyPlaceholder(defaultPlaceholderText, placeholderPrompts);
	}

	if (bracketPlaceholderText && bracketTyped(editorState) && isEditorFocused) {
		const { $from } = editorState.selection;
		// Space is to account for positioning of the bracket
		const bracketHint = '  ' + bracketPlaceholderText;
		return setPlaceHolderState(bracketHint, $from.pos - 1, placeholderPrompts);
	}

	return emptyPlaceholder(defaultPlaceholderText, placeholderPrompts);
}

export function createPlugin(
	intl: IntlShape,
	defaultPlaceholderText?: string,
	bracketPlaceholderText?: string,
	emptyLinePlaceholder?: string,
	placeholderPrompts?: string[],
	api?: ExtractInjectionAPI<PlaceholderPlugin>,
): SafePlugin | undefined {
	if (!defaultPlaceholderText && !placeholderPrompts && !bracketPlaceholderText) {
		return;
	}

	let isDestroyed = false;
	let activeTypewriterTimeouts: (() => void)[] = [];
	const clearAllTypewriterTimeouts = () => {
		activeTypewriterTimeouts.forEach((clearFn) => clearFn());
		activeTypewriterTimeouts = [];
	};

	return new SafePlugin<PlaceHolderState>({
		key: pluginKey,
		state: {
			init: (_, state) =>
				createPlaceHolderStateFrom({
					isEditorFocused: Boolean(api?.focus?.sharedState.currentState()?.hasFocus),
					editorState: state,
					isTypeAheadOpen: api?.typeAhead?.actions.isOpen,
					defaultPlaceholderText,
					bracketPlaceholderText,
					emptyLinePlaceholder,
					placeholderPrompts,
					intl,
				}),
			apply: (tr, placeholderState, _oldEditorState, newEditorState) => {
				const meta = tr.getMeta(pluginKey);
				const isEditorFocused = Boolean(api?.focus?.sharedState.currentState()?.hasFocus);

				const newPlaceholderState =
					meta?.placeholderText !== undefined || meta?.placeholderPrompts !== undefined
						? createPlaceHolderStateFrom({
								isEditorFocused,
								editorState: newEditorState,
								isTypeAheadOpen: api?.typeAhead?.actions.isOpen,
								defaultPlaceholderText:
									meta.placeholderText ??
									placeholderState?.placeholderText ??
									defaultPlaceholderText,
								bracketPlaceholderText,
								emptyLinePlaceholder,
								placeholderPrompts:
									meta.placeholderPrompts ??
									placeholderState?.placeholderPrompts ??
									placeholderPrompts,
								intl,
							})
						: createPlaceHolderStateFrom({
								isEditorFocused,
								editorState: newEditorState,
								isTypeAheadOpen: api?.typeAhead?.actions.isOpen,
								defaultPlaceholderText: placeholderState?.placeholderText ?? defaultPlaceholderText,
								bracketPlaceholderText,
								emptyLinePlaceholder,
								placeholderPrompts: placeholderState?.placeholderPrompts ?? placeholderPrompts,
								intl,
							});

				// Clear timeouts when hasPlaceholder becomes false
				if (!newPlaceholderState.hasPlaceholder) {
					clearAllTypewriterTimeouts();
				}

				return newPlaceholderState;
			},
		},
		props: {
			decorations(editorState): DecorationSet | undefined {
				const { hasPlaceholder, placeholderText, pos } = getPlaceholderState(editorState);

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
					((placeholderText ?? '') || placeholderPrompts) &&
					pos !== undefined &&
					!compositionPluginState?.isComposing &&
					!isShowingDiff
				) {
					return createPlaceholderDecoration(
						editorState,
						placeholderText ?? '',
						placeholderPrompts,
						activeTypewriterTimeouts,
						pos,
					);
				}
				return;
			},
		},
		view() {
			return {
				destroy() {
					clearAllTypewriterTimeouts();
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
				(placeholderPrompts: string[]) =>
				({ tr }) => {
					return tr.setMeta(pluginKey, { placeholderPrompts: placeholderPrompts });
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
							api,
						),
				},
			];
		},
	};
};
