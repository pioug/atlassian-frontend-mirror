import { Device, snapshotInformational } from '@af/visual-regression';

import LongTitle from '../../../examples/15-flag-long-title';
import LongContent from '../../../examples/16-flag-long-content';
import FlagGroupInModal from '../../../examples/20-flag-group-in-modal-dialog';
import {
	AppearanceFlags,
	MultipleFlags,
	SingleFlag,
} from '../../../examples/vr-flag-group-top-layer';

const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

const defaultLightVariants = [
	{
		name: 'default',
		environment: { colorScheme: 'light' as const },
	},
];

const mobileLightVariants = [
	{
		name: 'mobile',
		device: Device.MOBILE_CHROME,
		environment: { colorScheme: 'light' as const },
	},
];

snapshotInformational(SingleFlag, {
	description: 'single flag',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	variants: defaultLightVariants,
});

snapshotInformational(SingleFlag, {
	description: 'single flag mobile',
	variants: mobileLightVariants,
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
});

snapshotInformational(MultipleFlags, {
	description: 'multiple flags stacked',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	variants: defaultLightVariants,
});

snapshotInformational(AppearanceFlags, {
	description: 'appearance normal',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	variants: defaultLightVariants,
});

snapshotInformational(SingleFlag, {
	description: 'single flag action hovered',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	variants: defaultLightVariants,
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: { name: 'Understood' },
			},
		},
	],
});

snapshotInformational(SingleFlag, {
	description: 'single flag action focused',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	variants: defaultLightVariants,
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'button',
				options: { name: 'Understood' },
			},
		},
	],
});

snapshotInformational(LongTitle, {
	description: 'long title',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	variants: defaultLightVariants,
});

snapshotInformational(LongContent, {
	description: 'long content',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	variants: defaultLightVariants,
});

snapshotInformational(FlagGroupInModal, {
	description: 'flag in modal with shouldRenderToParent',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	variants: defaultLightVariants,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).first().click();
		await page.getByTestId('modal').waitFor({ state: 'visible' });
		await page.getByRole('button', { name: 'Add flag' }).click();
		await page.getByRole('alert').waitFor({ state: 'visible' });
	},
});
