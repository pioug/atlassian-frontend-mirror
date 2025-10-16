import { Device, snapshot } from '@af/visual-regression';

import ExampleComment from '../../../../examples/01-example-comment';
import NestedComments from '../../../../examples/03-nested-comments';
import TextOverflow from '../../../../examples/08-with-restricted-size-and-non-space-separated-content';
import WithInlineChildren from '../../../../examples/09-with-inline-children';
import LongAuthorCommentWithHeaderWrap from '../../../../examples/12-long-author-name-with-wrapping-header';
import LongAuthorCommentWithNoHeaderWrap from '../../../../examples/13-long-author-name-without-wrapping-header';
import LongAuthorCommentWithNoHeaderWrapPropSet from '../../../../examples/14-long-author-name-without-wrapping-header-prop-set';

snapshot(ExampleComment, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(TextOverflow);
snapshot(WithInlineChildren);
snapshot(NestedComments, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(LongAuthorCommentWithHeaderWrap, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
	],
	featureFlags: {
		'design-system-comment-header-wraps-by-default': [true, false],
	},
});

snapshot(LongAuthorCommentWithNoHeaderWrap, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
	],
	featureFlags: {
		'design-system-comment-header-wraps-by-default': [true, false],
	},
});

snapshot(LongAuthorCommentWithNoHeaderWrapPropSet, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
	],
	featureFlags: {
		'design-system-comment-header-wraps-by-default': [true, false],
	},
});
