import { Device, type Hooks, snapshot } from '@af/visual-regression';
import type { SnapshotTestOptions } from '@atlassian/gemini';

import Board from '../../examples/board';
import Grid from '../../examples/grid';
import List from '../../examples/list';
import Table from '../../examples/table';
import Tree from '../../examples/tree';

const defaultOptions: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
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

snapshot(List, defaultOptions);
snapshot(Board, defaultOptions);
snapshot(Grid, defaultOptions);
snapshot(Table, defaultOptions);
snapshot(Tree, defaultOptions);
