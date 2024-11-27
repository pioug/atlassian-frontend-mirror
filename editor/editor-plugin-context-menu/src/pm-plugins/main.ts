import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ContextMenuPlugin } from '../contextMenuPluginType';

import { openContextMenu } from './commands';

const contextMenuPluginKey = new PluginKey('contextMenu');

export const createPlugin = (api: ExtractInjectionAPI<ContextMenuPlugin> | undefined) =>
	new SafePlugin({
		key: contextMenuPluginKey,

		props: {
			// ProseMirror doesn't call handleClick for secondary clicks
			handleDOMEvents: {
				contextmenu: (_view: EditorView, event: MouseEvent) => {
					// Don't prevent default behaviour we just want to log analytics
					api?.core?.actions.execute(
						openContextMenu(api?.analytics?.actions)({
							button: event.button,
							altKey: event.altKey,
							ctrlKey: event.ctrlKey,
							shiftKey: event.shiftKey,
							metaKey: event.metaKey,
						}),
					);
				},
			},
		},
	});
