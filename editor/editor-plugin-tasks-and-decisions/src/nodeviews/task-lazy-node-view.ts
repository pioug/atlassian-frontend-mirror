import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { TasksAndDecisionsPlugin } from '../types';

import { taskItemNodeViewFactory } from './taskItem';

export const lazyTaskView = (
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
) => {
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return taskItemNodeViewFactory(portalProviderAPI, eventDispatcher, providerFactory, api);
	}

	return withLazyLoading({
		nodeName: 'taskItem',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-tasks-and-decisions_task-item-nodeview" */
				'./taskItem'
			).then(({ taskItemNodeViewFactory }) => {
				return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
					return taskItemNodeViewFactory(
						portalProviderAPI,
						eventDispatcher,
						providerFactory,
						api,
					)(node, view, getPos);
				};
			});
			return result;
		},
	});
};
