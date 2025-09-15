import React from 'react';
import defaultMD from 'react-markings';
import Code from '@atlaskit/code/inline';
import Heading from '@atlaskit/heading';
import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives/compiled';

// Tweak the styling
export const md = defaultMD.customize({
	renderers: {
		// Add a darker background to code elements
		code: (props) => <Code>{props.children}</Code>,

		// Improve the spacing for heading elements
		heading: ({ level, children }) => (
			<>
				<Box paddingBlock={levelToSpace[level]} />
				{/* Using this box as a margin (eeeeek)*/}
				<Heading size={levelToSize[level]}>{children}</Heading>
			</>
		),
		link: (props) => {
			const { href, children, ...otherProps } = props;

			// Check if this is an internal link (starts with /)
			const isInternalLink = href?.startsWith('/');

			// For external links, use Link component
			if (!isInternalLink) {
				return (
					<Link href={href} openNewTab {...otherProps}>
						{children}
					</Link>
				);
			}

			// Transform internal links for hash-based routing (staging Bifrost deployment)
			// When USE_HASH_ROUTER is true, convert "/docs/example" to "/#/docs/example"
			/*global USE_HASH_ROUTER*/
			const transformedHref = USE_HASH_ROUTER ? `/#${href}` : href;

			return (
				<Link href={transformedHref} {...otherProps}>
					{children}
				</Link>
			);
		},
	},
});

const levelToSize = ['xxlarge', 'xlarge', 'large', 'medium', 'small', 'xsmall', 'xxsmall'];
const levelToSpace = [
	'space.200',
	'space.200',
	'space.150',
	'space.100',
	'space.75',
	'space.50',
	'space.25',
];
