import { snapshot } from '@af/visual-regression';

import StackBasic from '../../../../examples/20-stack-basic.vr.ap';
import StackSpace from '../../../../examples/22-stack-space.vr.ap';
import StackAlignBlock from '../../../../examples/23-stack-align-block.vr.ap';
import StackAlignInline from '../../../../examples/24-stack-align-inline.vr.ap';
import StackSpread from '../../../../examples/25-stack-spread.vr.ap';
import StackGrow from '../../../../examples/26-stack-grow.vr.ap';

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
