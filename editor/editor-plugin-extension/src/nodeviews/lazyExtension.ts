import { ExtensionNodeView } from '@atlaskit/editor-common/extensibility';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { fg } from '@atlaskit/platform-feature-flags';

export function lazyExtensionNodeView(
	nodeName: string,
	...params: Parameters<typeof ExtensionNodeView>
) {
	if (!fg('platform_editor_lazy-node-views')) {
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
