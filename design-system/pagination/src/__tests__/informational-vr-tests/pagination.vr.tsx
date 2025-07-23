import { snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import BasicExample from '../../../examples/01-basic';
import CustomEllipsisExample from '../../../examples/04-with-custom-ellipsis';

const variants: SnapshotTestOptions<any>['variants'] = [
	{
		name: 'Light',
		environment: {
			colorScheme: 'light',
		},
	},
];

snapshotInformational(BasicExample, {
	description: 'after page change',
	variants,
	async prepare(page) {
		await page.getByRole('button', { name: 'Page 5' }).click();
	},
});

snapshotInformational(CustomEllipsisExample, {
	description: 'after expanding ellipsis',
	variants,
	async prepare(page) {
		await page.getByRole('button', { name: 'Expand list' }).click();
	},
});
