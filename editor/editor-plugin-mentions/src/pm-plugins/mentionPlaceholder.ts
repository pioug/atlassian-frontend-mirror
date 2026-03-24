import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

export const mentionPlaceholderPluginKey: PluginKey = new PluginKey('mentionPlaceholderPlugin');

export const MENTION_PLACEHOLDER_ACTIONS = {
	SHOW_PLACEHOLDER: 'SHOW_PLACEHOLDER',
	HIDE_PLACEHOLDER: 'HIDE_PLACEHOLDER',
};

export type MentionPlaceholderPluginState = {
	placeholder?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function createMentionPlaceholderPlugin(): SafePlugin<{}> {
	return new SafePlugin({
		key: mentionPlaceholderPluginKey,
		state: {
			init: () => ({}),
			apply(tr, pluginState: MentionPlaceholderPluginState) {
				const meta = tr.getMeta(mentionPlaceholderPluginKey);
				if (meta?.action === MENTION_PLACEHOLDER_ACTIONS.SHOW_PLACEHOLDER) {
					return { placeholder: meta.placeholder };
				}
				if (meta?.action === MENTION_PLACEHOLDER_ACTIONS.HIDE_PLACEHOLDER) {
					return {};
				}
				return pluginState;
			},
		},
		props: {
			decorations: (state) => {
				const pluginState = mentionPlaceholderPluginKey.getState(
					state,
				) as MentionPlaceholderPluginState;
				if (pluginState?.placeholder) {
					const { selection } = state;
					const span = document.createElement('span');
					span.textContent = pluginState.placeholder;
					span.style.setProperty('color', token('color.text.accent.blue'));
					return DecorationSet.create(state.doc, [Decoration.widget(selection.from, span)]);
				}
				return null;
			},
		},
	});
}
