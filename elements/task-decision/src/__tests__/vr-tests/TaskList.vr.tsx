import { snapshot } from '@af/visual-regression';
import { TaskListEditor, TaskListSingleTaskEditor } from './TaskList.fixtures';

const featureFlags = {
	platform_editor_css_migrate_stage_1: [true, false],
};

snapshot(TaskListEditor, {
	featureFlags,
});

snapshot(TaskListSingleTaskEditor, {
	featureFlags,
});
