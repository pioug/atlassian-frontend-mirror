/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import Heading, { type HeadingProps } from '@atlaskit/heading';
import { cssMap, jsx } from '@compiled/react';
import { CopyLinkToHeadingButton } from './copy-link-to-heading-button';
import { token } from '@atlaskit/tokens';

// This is a global variable provided by the rspack config.
// For some reason this package is not automatically picking up the types from typings/atlaskit.d.ts
// even though it's declared in the tsconfig
declare const USE_HASH_ROUTER: boolean;

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const levelToSize: Record<HeadingLevel, HeadingProps['size']> = {
	1: 'xlarge',
	2: 'large',
	3: 'medium',
	4: 'small',
	5: 'xsmall',
	6: 'xxsmall',
};

// If a heading is the first child, we don't need the additional top margin as it creates too
// much empty vertical space. So, the style is overriden in wrapperStyles.reducedSpacingForFirstChild
const levelToSpace = cssMap({
	1: { marginBlockStart: token('space.400'), marginBlockEnd: token('space.200') },
	2: { marginBlockStart: token('space.300'), marginBlockEnd: token('space.200') },
	3: { marginBlockStart: token('space.200'), marginBlockEnd: token('space.100') },
	4: { marginBlockStart: token('space.200'), marginBlockEnd: token('space.100') },
	5: { marginBlockStart: token('space.100') },
	6: { marginBlockStart: token('space.050') },
});

const wrapperStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		// These CSS variables are used in the `CopyLinkToHeadingButton` component.
		// We want to show the button when the user hovers over the wrapper element containing the heading.
		'--btn-opacity': '0',
		'--btn-transform': `translateX(${token('space.050')})`,
		'&:hover': {
			// @ts-ignore
			'--btn-opacity': '1',
			'--btn-transform': 'none',
		},
	},
	// If a heading is the first child, we don't need the additional top margin, as it creates too
	// much empty vertical space.
	reducedSpacingForFirstChild: {
		// @ts-ignore
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:first-of-type': {
			marginBlockStart: 0
		}
	}
});

/**
 * To support nested elements in the heading content, we need to extract the text from the node.
 * e.g.
 *
 * ```tsx
 * <HeadingWithSectionLink level={2}>
 *   This contains <code>nested</code> elements
 * </HeadingWithSectionLink>
 * ```
 */
function extractTextFromNode(node: React.ReactNode): string {
	if (typeof node === 'string') {
		return node;
	}
	if (typeof node === 'number') {
		return String(node);
	}
	if (Array.isArray(node)) {
		return node.map(extractTextFromNode).join(' ');
	}
	if (React.isValidElement(node) && node.props.children) {
		return extractTextFromNode(node.props.children);
	}
	return '';
}

function getHeadingId(value: React.ReactNode): string | null {
	if (!value) {
		return null;
	}

	const text = extractTextFromNode(value);
	if (!text.trim()) {
		return null;
	}

	return text.replace(/\s+/g, '-').toLowerCase();
}

/**
 * A heading with a button that appears on hover of the heading (or focus of the button),
 * that allows the user to copy a link to the heading.
 */
export function HeadingWithSectionLink({
	level,
	children,
}: {
	level: HeadingLevel;
	children: React.ReactNode;
}) {
	const headingId = getHeadingId(children);

	// Only show the copy link icon if:
	//  - the heading has a valid ID
	//  - the hash router is not being used (e.g. on staging environments). It does not work with hash routing as the hashes conflict.
	const showCopyLinkButton = headingId && !USE_HASH_ROUTER;

	return (
		<div css={[wrapperStyles.root, levelToSpace[level], wrapperStyles.reducedSpacingForFirstChild]}>
			{showCopyLinkButton && <CopyLinkToHeadingButton headingId={headingId} />}

			<Heading size={levelToSize[level]} id={headingId ?? undefined}>
				{children}
			</Heading>
		</div>
	);
}
