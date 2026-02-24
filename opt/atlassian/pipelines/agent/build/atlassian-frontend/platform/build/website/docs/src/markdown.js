import React from 'react';
import defaultMD from 'react-markings';
import Code from '@atlaskit/code/inline';

import { HeadingWithSectionLink } from './heading/heading-with-section-link';
import { Paragraph } from './paragraph';
import { List } from './list';
import { MarkdownLink } from './markdown-link';

// Tweak the styling
export const md = defaultMD.customize({
	renderers: {
		// Add a darker background to code elements
		code: (props) => <Code>{props.children}</Code>,
		// Note: this will only replace markdown headings using the `#` syntax, not heading elements like <h1>, <h2>, etc.
		heading: HeadingWithSectionLink,
		link: MarkdownLink,
		paragraph: Paragraph,
		list: List,
	},
});
