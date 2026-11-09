import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command } from '@atlaskit/editor-common/types/command';
import { PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';

import { numberedHeadingsPluginKey } from './main';

/**
 * With numbering on, Backspace in an empty heading removes the number by turning the heading into
 * a paragraph, wherever the heading sits (top level, panel, table cell, layout, expand...).
 *
 * Without this, the result depends on the container: at the top level the heading is joined into
 * the block before it, and in a panel the panel keymap deletes the whole panel. A second Backspace
 * then reaches those handlers on the paragraph, as it does today.
 *
 * Headings with text, range selections and numbering off are left to the other handlers.
 */
export const convertEmptyHeadingToParagraph: Command = (state, dispatch) => {
	if (!numberedHeadingsPluginKey.getState(state)?.enabled) {
		return false;
	}

	const { selection, schema } = state;
	if (!(selection instanceof TextSelection) || !selection.$cursor) {
		return false;
	}

	const { $cursor } = selection;
	const { parent } = $cursor;
	const { paragraph } = schema.nodes;
	if (parent.type !== schema.nodes.heading || parent.content.size > 0 || !paragraph) {
		return false;
	}

	const index = $cursor.index(-1);
	if (!$cursor.node(-1).canReplaceWith(index, index + 1, paragraph)) {
		return false;
	}

	if (dispatch) {
		// setBlockType drops block marks the paragraph's parent does not allow and keeps the cursor.
		dispatch(state.tr.setBlockType($cursor.pos, $cursor.pos, paragraph).scrollIntoView());
	}
	return true;
};

const isPlainBackspace = (event: KeyboardEvent): boolean =>
	event.key === 'Backspace' &&
	!event.metaKey &&
	!event.ctrlKey &&
	!event.altKey &&
	!event.shiftKey &&
	!event.isComposing &&
	!event.defaultPrevented;

export const numberedHeadingsKeymapPluginKey: PluginKey = new PluginKey('numberedHeadingsKeymap');

/**
 * Listens to the DOM keydown event rather than using a keymap. ProseMirror runs `handleDOMEvents`
 * before every `handleKeyDown` (keymap) prop, so this wins over the panel keymap regardless of the
 * order plugins are added to a preset. Unranked keymaps such as `panelKeyMap` otherwise run in
 * preset order, and presets add the panel plugin before this one.
 */
export const createNumberedHeadingsKeymapPlugin = (): SafePlugin =>
	new SafePlugin({
		key: numberedHeadingsKeymapPluginKey,
		props: {
			handleDOMEvents: {
				// A keymap would tie with the unranked `panelKeyMap` and lose in presets that add the
				// panel plugin first, which deletes the panel. DOM handlers run before every keymap.
				keydown: (view, event) => {
					if (!isPlainBackspace(event)) {
						return false;
					}
					const handled = convertEmptyHeadingToParagraph(view.state, view.dispatch);
					if (handled) {
						event.preventDefault();
					}
					return handled;
				},
			},
		},
	});
