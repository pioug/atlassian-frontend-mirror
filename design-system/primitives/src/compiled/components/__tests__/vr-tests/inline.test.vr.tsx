// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import InlineBasic from '../../../../../examples/10-inline-basic-compiled';
import InlineSeparator from '../../../../../examples/12-inline-separator-compiled';
import InlineSpace from '../../../../../examples/12-inline-space-compiled';
import InlineAlignBlock from '../../../../../examples/13-inline-align-block-compiled';
import InlineAlignInline from '../../../../../examples/14-inline-align-inline-compiled';
import InlineSpread from '../../../../../examples/15-inline-spread-compiled';
import InlineShouldWrap from '../../../../../examples/16-inline-should-wrap-compiled';
import InlineGrow from '../../../../../examples/17-inline-grow-compiled';

snapshot(InlineBasic, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(InlineSeparator, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(InlineSpace, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(InlineAlignBlock, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(InlineAlignInline, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(InlineSpread, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(InlineShouldWrap, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(InlineGrow, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
