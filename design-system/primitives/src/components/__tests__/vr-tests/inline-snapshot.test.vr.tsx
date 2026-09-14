import { snapshot } from '@af/visual-regression';

import InlineBasic from '../../../../examples/10-inline-basic.vr.ap';
import InlineSeparator from '../../../../examples/12-inline-separator.vr.ap';
import InlineSpace from '../../../../examples/12-inline-space.vr.ap';
import InlineAlignBlock from '../../../../examples/13-inline-align-block.vr.ap';
import InlineAlignInline from '../../../../examples/14-inline-align-inline.vr.ap';
import InlineSpread from '../../../../examples/15-inline-spread.vr.ap';
import InlineShouldWrap from '../../../../examples/16-inline-should-wrap.vr.ap';
import InlineGrow from '../../../../examples/17-inline-grow.vr.ap';

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
