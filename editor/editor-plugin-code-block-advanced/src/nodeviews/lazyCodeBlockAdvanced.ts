/**
 * Commented out for hot-114295
 */
export const noop = () => {};
// import { Extension } from '@codemirror/state';

// import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
// import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
// import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// import type { EditorView } from '@atlaskit/editor-prosemirror/view';

// import type { CodeBlockAdvancedPlugin } from '../codeBlockAdvancedPluginType';

// interface Props {
// 	api: ExtractInjectionAPI<CodeBlockAdvancedPlugin> | undefined;
// 	extensions: Extension[];
// }

// export const lazyCodeBlockView = (props: Props) => {
// 	return withLazyLoading({
// 		nodeName: 'codeBlock',
// 		getNodeViewOptions: () => {},
// 		loader: () => {
// 			const result = import(
// 				/* webpackChunkName: "@atlaskit-internal_editor-plugin-code-block-advanced-nodeview" */
// 				'./codeBlockAdvanced'
// 			).then(({ getCodeBlockAdvancedNodeView }) => {
// 				return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
// 					return getCodeBlockAdvancedNodeView(props)(node, view, getPos);
// 				};
// 			});
// 			return result;
// 		},
// 	});
// };
