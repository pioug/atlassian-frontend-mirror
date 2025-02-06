import { snapshot } from '@af/visual-regression';

import {
	DefaultCreateWithEditButton,
	DefaultCreateWithModal,
	DefaultCreateWithModalHero,
	DefaultCreateWithModalTitle,
} from '../../examples/vr/vr-create-modal';

type OptionsType = Parameters<typeof snapshot>[1];

const options: OptionsType = {
	drawsOutsideBounds: true,
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
};

snapshot(DefaultCreateWithModal, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
snapshot(DefaultCreateWithModalTitle, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
snapshot(DefaultCreateWithEditButton, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
snapshot(DefaultCreateWithModalHero, {
	...options,
	featureFlags: {
		'platform_bandicoots-link-create-css': [true, false],
	},
});
