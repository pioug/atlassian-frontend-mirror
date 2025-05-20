/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `createVRTest` in icon-build-process/src/create-vr-test.tsx.
 *
 * @codegen <<SignedSource::6269b49bd0c822556d5b45ff624290c6>>
 * @codegenCommand yarn build:icon-glyphs
 */
import { snapshot } from '@af/visual-regression';

import { MediumIconGroup0, MediumIconGroup1 } from './examples/all-utility-icons';

snapshot(MediumIconGroup0, {
	variants: [
		{
			name: 'Medium Group 0',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(MediumIconGroup1, {
	variants: [
		{
			name: 'Medium Group 1',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
