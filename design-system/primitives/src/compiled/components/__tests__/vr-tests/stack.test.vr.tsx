import { snapshot } from '@af/visual-regression';

import StackBasic from '../../../../../examples/20-stack-basic-compiled';
import StackSpace from '../../../../../examples/22-stack-space-compiled';
import StackAlignBlock from '../../../../../examples/23-stack-align-block-compiled';
import StackAlignInline from '../../../../../examples/24-stack-align-inline-compiled';
import StackSpread from '../../../../../examples/25-stack-spread-compiled';
import StackGrow from '../../../../../examples/26-stack-grow-compiled';

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
