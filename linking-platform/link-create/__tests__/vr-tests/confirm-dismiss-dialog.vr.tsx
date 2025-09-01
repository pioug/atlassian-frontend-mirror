import { snapshot } from '@af/visual-regression';

import { DefaultConfirmDismissDialog } from '../../examples/vr/vr-confirm-dismiss-dialog';

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

snapshot(DefaultConfirmDismissDialog, {
	...options,
	featureFlags: {
		'navx-1483-a11y-close-button-in-modal-updates': true,
	},
});
