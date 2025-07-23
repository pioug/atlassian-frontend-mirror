import { snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import BasicExample from '../../../examples/01-basic';
import CustomEllipsisExample from '../../../examples/04-with-custom-ellipsis';
import DisabledExample from '../../../examples/06-disabled';

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
