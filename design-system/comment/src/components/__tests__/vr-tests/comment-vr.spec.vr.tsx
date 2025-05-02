import { snapshot } from '@af/visual-regression';

import ExampleComment from '../../../../examples/01-example-comment';
import NestedComments from '../../../../examples/03-nested-comments';
import TextOverflow from '../../../../examples/08-with-restricted-size-and-non-space-separated-content';
import WithInlineChildren from '../../../../examples/10-with-inline-children';
import CommentWithHeaderWrap from '../../../../examples/13-comment-with-wrapping-header';

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

snapshot(CommentWithHeaderWrap, {
	featureFlags: {
		'platform-comment-header-wrap': [true, false],
	},
});
