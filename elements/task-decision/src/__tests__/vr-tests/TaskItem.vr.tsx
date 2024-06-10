import { snapshot } from '@af/visual-regression';
import {
	TaskItemEditor,
	TaskItemDoneEditor,
	TaskItemRenderer,
	TaskItemDoneRenderer,
} from './TaskItem.fixtures';

snapshot(TaskItemEditor);
snapshot(TaskItemEditor, {
	description: 'Task Item Editor - hovered',
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'checkbox' },
		},
	],
});
snapshot(TaskItemEditor, {
	description: 'Task Item Editor - focused',
	states: [
		{
			state: 'focused',
			selector: { byRole: 'checkbox' },
		},
	],
});
snapshot(TaskItemDoneEditor);
snapshot(TaskItemDoneEditor, {
	description: 'Task Item Editor - completed and focused',
	states: [
		{
			state: 'focused',
			selector: { byRole: 'checkbox' },
		},
	],
});

snapshot(TaskItemRenderer);
snapshot(TaskItemRenderer, {
	description: 'Task Item Renderer - focused',
	states: [
		{
			state: 'focused',
			selector: { byRole: 'checkbox' },
		},
	],
});
snapshot(TaskItemDoneRenderer);
snapshot(TaskItemDoneRenderer, {
	description: 'Task Item Renderer - completed and focused',
	states: [
		{
			state: 'focused',
			selector: { byRole: 'checkbox' },
		},
	],
});
