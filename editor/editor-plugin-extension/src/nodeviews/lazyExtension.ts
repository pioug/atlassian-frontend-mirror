import { ExtensionNodeView } from '@atlaskit/editor-common/extensibility';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export function lazyExtensionNodeView(
	nodeName: string,
	...params: Parameters<typeof ExtensionNodeView>
) {
	if (
		editorExperiment('platform_editor_exp_lazy_node_views', false) ||
		editorExperiment('platform_editor_exp_disable_lnv', true, { exposure: true })
	) {
		return ExtensionNodeView(...params);
	}

	return withLazyLoading({
		nodeName,
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-extension-nodeview" */
				'@atlaskit/editor-common/extensibility'
			).then(({ ExtensionNodeView }) => {
				return ExtensionNodeView(...params);
			});
			return result;
		},
	});
}
