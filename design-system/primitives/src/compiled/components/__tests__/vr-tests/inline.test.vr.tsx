import { snapshot } from '@af/visual-regression';

import InlineBasic from '../../../../../examples/10-inline-basic-compiled.vr.ap';
import InlineSeparator from '../../../../../examples/12-inline-separator-compiled.vr.ap';
import InlineSpace from '../../../../../examples/12-inline-space-compiled.vr.ap';
import InlineAlignBlock from '../../../../../examples/13-inline-align-block-compiled.vr.ap';
import InlineAlignInline from '../../../../../examples/14-inline-align-inline-compiled.vr.ap';
import InlineSpread from '../../../../../examples/15-inline-spread-compiled.vr.ap';
import InlineShouldWrap from '../../../../../examples/16-inline-should-wrap-compiled.vr.ap';
import InlineGrow from '../../../../../examples/17-inline-grow-compiled.vr.ap';

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
