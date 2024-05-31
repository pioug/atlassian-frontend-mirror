import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CompositionPluginState } from './plugin-key';
import { pluginKey } from './plugin-key';

const isLinux = () => navigator.userAgent.indexOf('Linux') >= 0;

export default () =>
	new SafePlugin<CompositionPluginState>({
		key: pluginKey,
		state: {
			init: (): CompositionPluginState => ({
				isComposing: false,
				zeroWidthSpacePos: undefined,
			}),
			apply: (tr, value): CompositionPluginState => {
				const isComposing: boolean = tr.getMeta(pluginKey);
				const zeroWidthSpacePos: number = tr.getMeta('zeroWidthSpacePos');
				if (typeof isComposing === 'undefined') {
					return value;
				}

				return {
					isComposing,
					zeroWidthSpacePos,
				};
			},
		},
		props: {
			handleDOMEvents: {
				compositionstart: (view: EditorView, event: Event): boolean => {
					const { tr } = view.state;
					tr.setMeta(pluginKey, true);

					// only apply for linux and cursor is at start of line
					if (isLinux() && view.state.selection.$from.parentOffset === 0) {
						tr.insertText(ZERO_WIDTH_SPACE);

						// remember the position of inserted zero width space
						tr.setMeta('zeroWidthSpacePos', view.state.selection.$from.pos);
					}

					view.dispatch(tr);
					return false;
				},
				compositionend: (view: EditorView, event: Event): boolean => {
					const { tr } = view.state;
					tr.setMeta(pluginKey, false);

					if (isLinux()) {
						const zeroWidthSpacePos = pluginKey.getState(view.state)?.zeroWidthSpacePos;
						if (typeof zeroWidthSpacePos !== 'undefined') {
							tr.deleteRange(zeroWidthSpacePos, zeroWidthSpacePos + 1);
						}
						tr.setMeta('zeroWidthSpacePos', undefined);
					}

					view.dispatch(tr);
					return false;
				},
			},
		},
	});
