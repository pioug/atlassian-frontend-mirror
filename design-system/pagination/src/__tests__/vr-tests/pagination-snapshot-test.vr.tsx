import { snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import BasicExample from '../../../examples/01-basic.vr.ap';
import CustomEllipsisExample from '../../../examples/04-with-custom-ellipsis.vr.ap';
import DisabledExample from '../../../examples/06-disabled.vr.ap';

const variants: SnapshotTestOptions<any>['variants'] = [
	{
		name: 'Light',
		environment: {
			colorScheme: 'light',
		},
	},
];

snapshot(BasicExample, { variants });

snapshot(CustomEllipsisExample, { variants });

snapshot(DisabledExample, {
	variants,
});
