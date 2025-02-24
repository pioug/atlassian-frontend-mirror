import { snapshot } from '@af/visual-regression';
import { TaskRenderer, TaskRendererWithReactLooselyLazy } from './task.fixture';

const featureFlags = {
	platform_editor_css_migrate_stage_1: [true, false],
};

snapshot(TaskRenderer, {
	featureFlags,
});
snapshot(TaskRendererWithReactLooselyLazy, {
	featureFlags,
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/u,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
});
