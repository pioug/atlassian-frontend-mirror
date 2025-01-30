/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `createIconVRTest` in icon-build-process/src/create-vr-test.tsx.
 *
 * @codegen <<SignedSource::1d7688496a50372ae393400bdc7404af>>
 * @codegenCommand yarn build:icon-glyphs
 */
import { snapshot } from '@af/visual-regression';

import { IconGroup0, IconGroup1 } from './examples/all-core-icons';

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
