import { Device, type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import Basic from '../../../examples/00-basic-usage.vr.ap';
import Layout from '../../../examples/01-layout-example.vr.ap';
import NestedGrid from '../../../examples/02-nested-grid-example.vr.ap';
import Spacing from '../../../examples/03-spacing-example.vr.ap';
import Columns from '../../../examples/05-columns.vr.ap';
import FixedLayout from '../../../examples/06-fixed-layout.vr.ap';
import FluidLayout from '../../../examples/07-fluid-layout.vr.ap';
import EdgeCases from '../../../examples/08-edge-cases.vr.ap';

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
