import { snapshot } from '@af/visual-regression';

import StackBasic from '../../../../../examples/20-stack-basic-compiled.vr.ap';
import StackSpace from '../../../../../examples/22-stack-space-compiled.vr.ap';
import StackAlignBlock from '../../../../../examples/23-stack-align-block-compiled.vr.ap';
import StackAlignInline from '../../../../../examples/24-stack-align-inline-compiled.vr.ap';
import StackSpread from '../../../../../examples/25-stack-spread-compiled.vr.ap';
import StackGrow from '../../../../../examples/26-stack-grow-compiled.vr.ap';

snapshot(StackBasic, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(StackSpace, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(StackAlignBlock, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(StackAlignInline, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(StackSpread, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(StackGrow, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
