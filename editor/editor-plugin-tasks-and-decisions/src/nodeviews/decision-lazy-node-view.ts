import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { TasksAndDecisionsPlugin } from '../tasksAndDecisionsPluginType';

import { decisionItemNodeView } from './decisionItem';

export const lazyDecisionView = (
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
) => {
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return decisionItemNodeView(portalProviderAPI, eventDispatcher, api);
	}

	return withLazyLoading({
		nodeName: 'decisionItem',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-tasks-and-decisions_decision-item-nodeview" */
				'./decisionItem'
			).then(({ decisionItemNodeView }) => {
				return decisionItemNodeView(portalProviderAPI, eventDispatcher, api);
			});
			return result;
		},
	});
};
