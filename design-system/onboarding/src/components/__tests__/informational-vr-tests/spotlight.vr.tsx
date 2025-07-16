import { type Hooks, snapshotInformational, type SnapshotTestOptions } from '@af/visual-regression';

import SpotlightDialogPlacement from '../../../../examples/30-spotlight-dialog-placement';
import SpotlightButtonAppearance from '../../../../examples/90-spotlight-button-appearance';
import SpotlightWithoutPulse from '../../../../examples/96-spotlight-without-pulse';

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{
		name: 'light',
		environment: {
			colorScheme: 'light',
		},
	},
];

snapshotInformational(SpotlightDialogPlacement, {
	description: 'should render next to target',
	variants,
	drawsOutsideBounds: true,
	async prepare(page) {
		await page.getByRole('button', { name: 'Show' }).click();
		await page.locator('[data-testid="spotlight--dialog"]').waitFor({ state: 'visible' });
	},
});

snapshotInformational(SpotlightDialogPlacement, {
	description: 'should update after viewport resize',
	variants,
	drawsOutsideBounds: true,
	async prepare(page) {
		await page.getByRole('button', { name: 'Show' }).click();
		await page.locator('[data-testid="spotlight--dialog"]').waitFor({ state: 'visible' });

		await page.setViewportSize({
			height: 720,
			width: 1080,
		});
	},
});

snapshotInformational(SpotlightButtonAppearance, {
	variants,
	drawsOutsideBounds: true,
	async prepare(page) {
		await page.getByRole('button', { name: 'Show' }).click();
		await page.locator('[data-testid="spotlight--dialog"]').waitFor({ state: 'visible' });
	},
});

snapshotInformational(SpotlightWithoutPulse, {
	description: 'should not display pulse animation when pulse prop is false',
	variants,
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByTestId('open-spotlight').click();
		await page.getByTestId('spotlight--target').waitFor();
		await page.getByTestId('spotlight--dialog').click();
	},
});
