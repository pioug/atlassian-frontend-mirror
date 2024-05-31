import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI, NextEditorPlugin } from '@atlaskit/editor-common/types';
import { bracketTyped, browser, isEmptyDocument } from '@atlaskit/editor-common/utils';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

export const pluginKey = new PluginKey('placeholderPlugin');

interface PlaceHolderState {
	hasPlaceholder: boolean;
	placeholderText?: string;
	pos?: number;
}

function getPlaceholderState(editorState: EditorState): PlaceHolderState {
	return pluginKey.getState(editorState);
}
export const placeholderTestId = 'placeholder-test-id';

export function createPlaceholderDecoration(
	editorState: EditorState,
	placeholderText: string,
	pos: number = 1,
): DecorationSet {
	const placeholderDecoration = document.createElement('span');
	let placeholderNodeWithText = placeholderDecoration;

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

	placeholderNodeWithText.textContent = placeholderText || ' ';

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

	return DecorationSet.create(editorState.doc, [
		Decoration.widget(pos, placeholderDecoration, {
			side: 0,
			key: 'placeholder',
		}),
	]);
}

function setPlaceHolderState(placeholderText: string, pos?: number): PlaceHolderState {
	return {
		hasPlaceholder: true,
		placeholderText,
		pos: pos ? pos : 1,
	};
}

const emptyPlaceholder: PlaceHolderState = { hasPlaceholder: false };

function createPlaceHolderStateFrom(
	isEditorFocused: boolean,
	editorState: EditorState,
	isTypeAheadOpen: ((editorState: EditorState) => boolean) | undefined,
	defaultPlaceholderText?: string,
	bracketPlaceholderText?: string,
): PlaceHolderState {
	if (isTypeAheadOpen?.(editorState)) {
		return emptyPlaceholder;
	}

	if (defaultPlaceholderText && isEmptyDocument(editorState.doc)) {
		return setPlaceHolderState(defaultPlaceholderText);
	}

	if (bracketPlaceholderText && bracketTyped(editorState) && isEditorFocused) {
		const { $from } = editorState.selection;
		// Space is to account for positioning of the bracket
		const bracketHint = '  ' + bracketPlaceholderText;
		return setPlaceHolderState(bracketHint, $from.pos - 1);
	}
	return emptyPlaceholder;
}

export function createPlugin(
	defaultPlaceholderText?: string,
	bracketPlaceholderText?: string,
	api?: ExtractInjectionAPI<PlaceholderPlugin>,
): SafePlugin | undefined {
	if (!defaultPlaceholderText && !bracketPlaceholderText) {
		return;
	}

	return new SafePlugin<PlaceHolderState>({
		key: pluginKey,
		state: {
			init: (_, state) =>
				createPlaceHolderStateFrom(
					Boolean(api?.focus?.sharedState.currentState()?.hasFocus),
					state,
					api?.typeAhead?.actions.isOpen,
					defaultPlaceholderText,
					bracketPlaceholderText,
				),
			apply: (tr, _oldPluginState, _oldEditorState, newEditorState) => {
				const meta = tr.getMeta(pluginKey);
				const isEditorFocused = Boolean(api?.focus?.sharedState.currentState()?.hasFocus);

				if (meta) {
					if (meta.removePlaceholder) {
						return emptyPlaceholder;
					}

					if (meta.applyPlaceholderIfEmpty) {
						return createPlaceHolderStateFrom(
							isEditorFocused,
							newEditorState,
							api?.typeAhead?.actions.isOpen,
							defaultPlaceholderText,
							bracketPlaceholderText,
						);
					}
				}

				return createPlaceHolderStateFrom(
					isEditorFocused,
					newEditorState,
					api?.typeAhead?.actions.isOpen,
					defaultPlaceholderText,
					bracketPlaceholderText,
				);
			},
		},
		props: {
			decorations(editorState): DecorationSet | undefined {
				const { hasPlaceholder, placeholderText, pos } = getPlaceholderState(editorState);

				const compositionPluginState = api?.composition?.sharedState.currentState();
				if (
					hasPlaceholder &&
					placeholderText &&
					pos !== undefined &&
					!compositionPluginState?.isComposing
				) {
					return createPlaceholderDecoration(editorState, placeholderText, pos);
				}
				return;
			},
		},
	});
}

export interface PlaceholderPluginOptions {
	placeholder?: string;
	placeholderBracketHint?: string;
}

export type PlaceholderPlugin = NextEditorPlugin<
	'placeholder',
	{
		pluginConfiguration: PlaceholderPluginOptions | undefined;
		dependencies: [FocusPlugin, CompositionPlugin, TypeAheadPlugin];
	}
>;

export const placeholderPlugin: PlaceholderPlugin = ({ config: options, api }) => ({
	name: 'placeholder',

	pmPlugins() {
		return [
			{
				name: 'placeholder',
				plugin: () =>
					createPlugin(
						options && options.placeholder,
						options && options.placeholderBracketHint,
						api,
					),
			},
		];
	},
});
