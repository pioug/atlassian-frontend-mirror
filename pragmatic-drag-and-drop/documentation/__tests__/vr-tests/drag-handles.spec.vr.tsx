import { Device, type Hooks, snapshot } from '@af/visual-regression';
import type { SnapshotTestOptions } from '@atlassian/gemini';

import { AllDragHandleVariants } from '../../examples/guidelines/all-drag-handle-variants';

const defaultOptions: SnapshotTestOptions<Hooks> = {
	variants: [
		{
			name: 'light',
			device: Device.DESKTOP_CHROME,
			environment: {
				colorScheme: 'light',
			},
		},
	],
};

snapshot(AllDragHandleVariants, {
	description: 'all drag handles with no states',
	...defaultOptions,
});

snapshot(AllDragHandleVariants, {
	...defaultOptions,
	description: 'hover drag handle',
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'hover-drag-handle',
				options: {
					name: 'with hover drag handle (hover)',
				},
			},
		},
	],
});

snapshot(AllDragHandleVariants, {
	...defaultOptions,
	description: 'hover drag handle outside bounds',
	drawsOutsideBounds: true,
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'hover-drag-handle-outside-bounds',
				options: {
					name: 'with hover drag handle outside bounds (hover)',
				},
			},
		},
	],
});
