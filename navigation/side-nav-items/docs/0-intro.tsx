import { type DocsTabs } from '@atlaskit/docs';

import { CodeTab } from './tabs/code';
import { DragAndDropTab } from './tabs/drag-and-drop';
import { ExamplesTab } from './tabs/examples';
import { UsageTab } from './tabs/usage';

// This is used by the website generator to define which components are tabs, and the tab order.
// If this export is not present, tabs are generated in case-sensitive alphabetical-order (not source-code order).
export const _DocsTabs: DocsTabs = [
	{
		content: ExamplesTab,
		name: 'Examples',
	},
	{
		content: DragAndDropTab,
		name: 'Drag and drop',
	},
	{
		content: CodeTab,
		name: 'Code',
	},
	{
		content: UsageTab,
		name: 'Usage',
	},
];
