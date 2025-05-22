import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { ResizingMarkView } from './resizing-mark-view';

export const resizingPluginKey = new PluginKey('breakout-resizing');

export const createResizingPlugin = () => {
	return new SafePlugin({
		key: resizingPluginKey,
		props: {
			markViews: {
				breakout: (mark: Mark, view: EditorView) => {
					return new ResizingMarkView(mark, view);
				},
			},
		},
	});
};
