import { Device, type Hooks, snapshot } from '@af/visual-regression';
// oxlint-disable-next-line @atlassian/no-restricted-imports
import type { SnapshotTestOptions } from '@atlassian/gemini';

import Board from '../../examples/board.vr.ap';
import Grid from '../../examples/grid.vr.ap';
import List from '../../examples/list.vr.ap';
import Table from '../../examples/table.vr.ap';
import Tree from '../../examples/tree.vr.ap';

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
