/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `createVRTest` in icon-build-process/src/create-vr-test.tsx.
 *
 * @codegen <<SignedSource::eb2d7e0ca7808980d5ac3e4d40b073a6>>
 * @codegenCommand yarn build:icon-glyphs
 */
import { snapshot } from '@af/visual-regression';

import { IconGroup0, IconGroup1 } from './examples/all-utility-icons';

snapshot(IconGroup0, {
	variants: [
		{
			name: 'Group 0',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(IconGroup1, {
	variants: [
		{
			name: 'Group 1',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
