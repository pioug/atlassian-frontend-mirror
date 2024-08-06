import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { type PortalProviderAPI } from '@atlaskit/editor-common/src/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { TasksAndDecisionsPlugin } from '../types';

import { decisionItemNodeView } from './decisionItem';

export const lazyDecisionView = (
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
) => {
	if (!fg('platform_editor_lazy-node-views')) {
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
