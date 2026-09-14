import { Device, snapshot } from '@af/visual-regression';

import ExampleComment from '../../../../examples/01-example-comment.vr.ap';
import NestedComments from '../../../../examples/03-nested-comments.vr.ap';
import TextOverflow from '../../../../examples/08-with-restricted-size-and-non-space-separated-content.vr.ap';
import WithInlineChildren from '../../../../examples/09-with-inline-children.vr.ap';
import LongAuthorCommentWithHeaderWrap from '../../../../examples/12-long-author-name-with-wrapping-header.vr.ap';
import LongAuthorCommentWithNoHeaderWrap from '../../../../examples/13-long-author-name-without-wrapping-header.vr.ap';
import LongAuthorCommentWithNoHeaderWrapPropSet from '../../../../examples/14-long-author-name-without-wrapping-header-prop-set.vr.ap';

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
});

snapshot(LongAuthorCommentWithNoHeaderWrap, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(LongAuthorCommentWithNoHeaderWrapPropSet, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
	],
});
