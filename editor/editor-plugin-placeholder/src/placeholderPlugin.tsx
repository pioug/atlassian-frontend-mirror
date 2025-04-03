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
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { PlaceholderPlugin } from './placeholderPluginType';

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

const nodeTypesWithLongPlaceholderText = ['expand', 'panel'];
const nodeTypesWithShortPlaceholderText = ['tableCell', 'tableHeader'];

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

function setPlaceHolderState(placeholderText: string, pos?: number): PlaceHolderState {
	return {
		hasPlaceholder: true,
		placeholderText,
		pos: pos ? pos : 1,
	};
}

const emptyPlaceholder = (placeholderText: string | undefined): PlaceHolderState => ({
	hasPlaceholder: false,
	placeholderText,
});

type CreatePlaceholdeStateProps = {
	isEditorFocused: boolean;
	editorState: EditorState;
	isTypeAheadOpen: ((editorState: EditorState) => boolean) | undefined;
	defaultPlaceholderText: string | undefined;
	intl: IntlShape;
	bracketPlaceholderText?: string;
	emptyLinePlaceholder?: string;
};

function createPlaceHolderStateFrom({
	isEditorFocused,
	editorState,
	isTypeAheadOpen,
	defaultPlaceholderText,
	intl,
	bracketPlaceholderText,
	emptyLinePlaceholder,
}: CreatePlaceholdeStateProps): PlaceHolderState {
	if (isTypeAheadOpen?.(editorState)) {
		return emptyPlaceholder(defaultPlaceholderText);
	}

	if (defaultPlaceholderText && isEmptyDocument(editorState.doc)) {
		return setPlaceHolderState(defaultPlaceholderText);
	}

	if (isEditorFocused && editorExperiment('platform_editor_controls', 'variant1')) {
		const { $from, $to } = editorState.selection;

		if ($from.pos !== $to.pos) {
			return emptyPlaceholder(defaultPlaceholderText);
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
			return setPlaceHolderState(
				intl.formatMessage(messages.shortEmptyNodePlaceholderText),
				$from.pos,
			);
		}

		if (nodeTypesWithLongPlaceholderText.includes(parentType) && isEmptyNode) {
			return setPlaceHolderState(
				intl.formatMessage(messages.longEmptyNodePlaceholderText),
				$from.pos,
			);
		}

		return emptyPlaceholder(defaultPlaceholderText);
	}

	if (bracketPlaceholderText && bracketTyped(editorState) && isEditorFocused) {
		const { $from } = editorState.selection;
		// Space is to account for positioning of the bracket
		const bracketHint = '  ' + bracketPlaceholderText;
		return setPlaceHolderState(bracketHint, $from.pos - 1);
	}

	return emptyPlaceholder(defaultPlaceholderText);
}

export function createPlugin(
	intl: IntlShape,
	defaultPlaceholderText?: string,
	bracketPlaceholderText?: string,
	emptyLinePlaceholder?: string,
	api?: ExtractInjectionAPI<PlaceholderPlugin>,
): SafePlugin | undefined {
	if (!defaultPlaceholderText && !bracketPlaceholderText) {
		return;
	}

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
					intl,
				}),
			apply: (tr, placeholderState, _oldEditorState, newEditorState) => {
				const meta = tr.getMeta(pluginKey);
				const isEditorFocused = Boolean(api?.focus?.sharedState.currentState()?.hasFocus);
				if (meta?.placeholderText !== undefined) {
					return createPlaceHolderStateFrom({
						isEditorFocused,
						editorState: newEditorState,
						isTypeAheadOpen: api?.typeAhead?.actions.isOpen,
						defaultPlaceholderText: meta.placeholderText,
						bracketPlaceholderText,
						emptyLinePlaceholder,
						intl,
					});
				}

				return createPlaceHolderStateFrom({
					isEditorFocused,
					editorState: newEditorState,
					isTypeAheadOpen: api?.typeAhead?.actions.isOpen,
					defaultPlaceholderText: placeholderState?.placeholderText ?? defaultPlaceholderText,
					bracketPlaceholderText,
					emptyLinePlaceholder,
					intl,
				});
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

export const placeholderPlugin: PlaceholderPlugin = ({ config: options, api }) => {
	let currentPlaceholder = options?.placeholder;

	return {
		name: 'placeholder',

		commands: {
			setPlaceholder:
				(placeholderText) =>
				({ tr }) => {
					if (currentPlaceholder !== placeholderText) {
						currentPlaceholder = placeholderText;
						return tr.setMeta(pluginKey, { placeholderText: placeholderText });
					}
					return null;
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
							api,
						),
				},
			];
		},
	};
};
