import { type Extension } from '@codemirror/state';
import type { IntlShape } from 'react-intl-next';

import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, DecorationSource, Decoration } from '@atlaskit/editor-prosemirror/view';

import type { CodeBlockAdvancedPlugin } from '../codeBlockAdvancedPluginType';

interface Props {
	allowCodeFolding: boolean;
	api: ExtractInjectionAPI<CodeBlockAdvancedPlugin> | undefined;
	extensions: Extension[];
	getIntl: () => IntlShape;
}

export const lazyCodeBlockView = (props: Props) => {
	return withLazyLoading({
		nodeName: 'codeBlock',
		getNodeViewOptions: () => {},
		loader: async () => {
			const { getCodeBlockAdvancedNodeView } = await import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-code-block-advanced-nodeview" */
				'./codeBlockAdvanced'
			);
			return (
				node: PMNode,
				view: EditorView,
				getPos: () => number | undefined,
				_decs: readonly Decoration[],
				_nodeViewOptions: () => void,
				innerDecorations: DecorationSource,
			) => getCodeBlockAdvancedNodeView(props)(node, view, getPos, innerDecorations);
		},
	});
};
