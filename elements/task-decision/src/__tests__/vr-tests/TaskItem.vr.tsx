import { snapshot } from '@af/visual-regression';
import {
	TaskItemEditor,
	TaskItemDoneEditor,
	TaskItemRenderer,
	TaskItemDoneRenderer,
} from './TaskItem.fixtures';

const featureFlags = {
	platform_editor_css_migrate_stage_1: [true, false],
};

snapshot(TaskItemEditor, {
	featureFlags,
});
snapshot(TaskItemEditor, {
	description: 'Task Item Editor - hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'checkbox' },
		},
	],
	featureFlags,
});
snapshot(TaskItemEditor, {
	description: 'Task Item Editor - focused',
	states: [
		{
			state: 'focused',
			selector: { byRole: 'checkbox' },
		},
	],
	featureFlags,
});
snapshot(TaskItemDoneEditor, {
	featureFlags,
});
snapshot(TaskItemDoneEditor, {
	description: 'Task Item Editor - completed and focused',
	states: [
		{
			state: 'focused',
			selector: { byRole: 'checkbox' },
		},
	],
	featureFlags,
});

snapshot(TaskItemRenderer, {
	featureFlags,
});
snapshot(TaskItemRenderer, {
	description: 'Task Item Renderer - focused',
	states: [
		{
			state: 'focused',
			selector: { byRole: 'checkbox' },
		},
	],
	featureFlags,
});
snapshot(TaskItemDoneRenderer, {
	featureFlags,
});
snapshot(TaskItemDoneRenderer, {
	description: 'Task Item Renderer - completed and focused',
	states: [
		{
			state: 'focused',
			selector: { byRole: 'checkbox' },
		},
	],
	featureFlags,
});
