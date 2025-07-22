import { type Hooks, snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import ComplexLayeringExample from '../../../examples/1-complex-layering';
import StackingContextExample from '../../../examples/2-stacking-context';
import ReRenderExample from '../../../examples/4-portal-re-render';

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{ name: 'Light', environment: { colorScheme: 'light' } },
];

snapshotInformational(StackingContextExample, { variants, drawsOutsideBounds: true });

snapshotInformational(ReRenderExample, {
	description: 'changing z-index should not change stacking context',
	variants,
	drawsOutsideBounds: true,
	async prepare(page) {
		await page.getByRole('button', { name: 'Toggle z-index' }).click();
	},
});

snapshotInformational(ReRenderExample, {
	description: 'changing children should not change stacking context',
	variants,
	drawsOutsideBounds: true,
	async prepare(page) {
		await page.getByRole('button', { name: 'Change child value of Portal 2' }).click();
	},
});

snapshotInformational(ComplexLayeringExample, {
	variants,
	drawsOutsideBounds: true,
	async prepare(page) {
		await page.getByRole('button', { name: 'Open Dialog' }).click();

		await page.getByRole('button', { name: 'Open another' }).click();

		await page.getByRole('button', { name: 'Show an flag' }).click();

		await page.getByRole('button', { name: 'Show onboarding' }).click();
	},
});
