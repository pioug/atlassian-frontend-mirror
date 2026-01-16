import React from 'react';
import defaultMD from 'react-markings';
import Code from '@atlaskit/code/inline';
import Link from '@atlaskit/link';

import { HeadingWithSectionLink } from './heading/heading-with-section-link';

// Tweak the styling
export const md = defaultMD.customize({
	renderers: {
		// Add a darker background to code elements
		code: (props) => <Code>{props.children}</Code>,
		// Note: this will only replace markdown headings using the `#` syntax, not heading elements like <h1>, <h2>, etc.
		heading: ({ level, children }) => (
			<HeadingWithSectionLink level={level}>{children}</HeadingWithSectionLink>
		),
		link: (props) => {
			const { children, href, ...otherProps } = props;

			const isRelativePath = (path) => path?.startsWith('./') || path?.startsWith('/');
			const target = isRelativePath(href) ? '_self' : '_blank';

			return (
				<Link target={target} href={href} {...otherProps}>
					{children}
				</Link>
			);
		},
	},
});
