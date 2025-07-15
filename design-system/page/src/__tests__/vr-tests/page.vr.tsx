import { Device, type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import Basic from '../../../examples/00-basic-usage';
import Layout from '../../../examples/01-layout-example';
import NestedGrid from '../../../examples/02-nested-grid-example';
import Spacing from '../../../examples/03-spacing-example';
import Columns from '../../../examples/05-columns';
import FixedLayout from '../../../examples/06-fixed-layout';
import FluidLayout from '../../../examples/07-fluid-layout';
import EdgeCases from '../../../examples/08-edge-cases';

const defaultVariants: SnapshotTestOptions<Hooks>['variants'] = [
	{
		name: 'light',
		environment: {
			colorScheme: 'light',
		},
	},
];

snapshot(Basic, { variants: defaultVariants });
snapshot(Layout, {
	variants: [
		...defaultVariants,
		{ name: 'mobile', environment: { colorScheme: 'light' }, device: Device.MOBILE_CHROME },
	],
});
snapshot(NestedGrid, { variants: defaultVariants });
snapshot(Spacing, { variants: defaultVariants });
snapshot(Columns, { variants: defaultVariants });
snapshot(FixedLayout, { variants: defaultVariants });
snapshot(FluidLayout, { variants: defaultVariants });
snapshot(EdgeCases, { variants: defaultVariants });
