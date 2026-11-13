import { Device, snapshotInformational } from '@af/visual-regression';

import LongTitle from '../../../examples/15-flag-long-title.vr.ap';
import LongContent from '../../../examples/16-flag-long-content.vr.ap';
import FlagGroupInModal from '../../../examples/20-flag-group-in-modal-dialog.vr.ap';
import {
	AppearanceFlags,
	FlagsOverModal,
	MultipleFlags,
	SingleFlag,
} from '../../../examples/vr-flag-group-top-layer.vr.ap';

const featureFlagVariants = {
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
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
});

snapshotInformational(SingleFlag, {
	description: 'single flag mobile',
	variants: mobileLightVariants,
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
});

snapshotInformational(MultipleFlags, {
	description: 'multiple flags stacked',
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
});

snapshotInformational(AppearanceFlags, {
	description: 'appearance normal',
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
});

snapshotInformational(SingleFlag, {
	description: 'single flag action hovered',
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
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
	featureFlags: featureFlagVariants,
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
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
});

snapshotInformational(LongContent, {
	description: 'long content',
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
});

snapshotInformational(FlagGroupInModal, {
	description: 'flag in modal with shouldRenderToParent',
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).first().click();
		await page.getByTestId('modal').waitFor({ state: 'visible' });
		await page.getByRole('button', { name: 'Add flag' }).click();
		await page.getByRole('alert').waitFor({ state: 'visible' });
	},
});

// Each flag has its own top-layer host, which picks its place when the flag mounts.
snapshotInformational(FlagsOverModal, {
	description: 'flag shown while a modal is open',
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByTestId('modal').waitFor({ state: 'visible' });
		await page.getByRole('button', { name: 'Show flag in modal' }).click();
		await page.getByText('Shown in the modal').waitFor({ state: 'visible' });
	},
});

snapshotInformational(FlagsOverModal, {
	description: 'flag shown before a modal opens',
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Show flag' }).click();
		await page.getByText('Shown before the modal').waitFor({ state: 'visible' });
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByTestId('modal').waitFor({ state: 'visible' });
	},
});

snapshotInformational(FlagsOverModal, {
	description: 'new flag in a modal over an earlier flag',
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Show flag' }).click();
		await page.getByText('Shown before the modal').waitFor({ state: 'visible' });
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByTestId('modal').waitFor({ state: 'visible' });
		await page.getByRole('button', { name: 'Show flag in modal' }).click();
		await page.getByText('Shown in the modal').waitFor({ state: 'visible' });
	},
});

// A real click: an inert flag under the modal would not get it.
snapshotInformational(FlagsOverModal, {
	description: 'flag shown while a modal is open is dismissed with a click',
	drawsOutsideBounds: true,
	featureFlags: featureFlagVariants,
	variants: defaultLightVariants,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Show flag' }).click();
		await page.getByText('Shown before the modal').waitFor({ state: 'visible' });
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByTestId('modal').waitFor({ state: 'visible' });
		await page.getByRole('button', { name: 'Show flag in modal' }).click();
		await page.getByText('Shown in the modal').waitFor({ state: 'visible' });
		await page
			.getByRole('alert')
			.filter({ hasText: 'Shown in the modal' })
			.getByRole('button', { name: /dismiss/i })
			.click({ timeout: 5000 });
		await page.getByText('Shown in the modal').waitFor({ state: 'detached' });
	},
});
