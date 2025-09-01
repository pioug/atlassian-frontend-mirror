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
		'navx-1483-a11y-close-button-in-modal-updates': true,
	},
});
snapshot(DefaultCreateWithModalTitle, {
	...options,
	featureFlags: {
		'navx-1483-a11y-close-button-in-modal-updates': true,
	},
});
snapshot(DefaultCreateWithEditButton, {
	...options,
	featureFlags: {
		'navx-1483-a11y-close-button-in-modal-updates': true,
	},
});
snapshot(DefaultCreateWithModalHero, {
	...options,
	featureFlags: {
		'navx-1483-a11y-close-button-in-modal-updates': true,
	},
});
