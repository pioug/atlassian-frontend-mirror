import { snapshot } from '@af/visual-regression';
import { TaskRenderer, TaskRendererWithReactLooselyLazy } from './task.fixture';

snapshot(TaskRenderer, {
	featureFlags: {
		platform_editor_blocktaskitem_node_tenantid: true,
	},
});
snapshot(TaskRendererWithReactLooselyLazy, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/u,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
	featureFlags: {
		platform_editor_blocktaskitem_node_tenantid: true,
	},
});
