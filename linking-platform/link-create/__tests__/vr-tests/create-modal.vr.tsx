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
});
snapshot(DefaultCreateWithModalTitle, {
	...options,
});
snapshot(DefaultCreateWithEditButton, {
	...options,
});
snapshot(DefaultCreateWithModalHero, {
	...options,
});
