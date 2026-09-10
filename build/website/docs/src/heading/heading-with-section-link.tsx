/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import Heading, { type HeadingProps } from '@atlaskit/heading';
import { cssMap, jsx } from '@compiled/react';
import { CopyLinkToHeadingButton } from './copy-link-to-heading-button';
import { token } from '@atlaskit/tokens';

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
			marginBlockStart: 0,
		},
	},
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
 *
 * @example
 * ```tsx
 * import { HeadingWithSectionLink } from '@atlaskit/docs/heading-with-section-link';
 *
 * <HeadingWithSectionLink level={2}>Usage</HeadingWithSectionLink>;
 * ```
 */
export function HeadingWithSectionLink({
	level,
	children,
	spacing = 'default',
}: {
	level: HeadingLevel;
	children: React.ReactNode;
	/**
	 * Controls the heading wrapper's built-in vertical margins. Use `none` when a parent layout
	 * component already manages the spacing between elements.
	 */
	spacing?: 'default' | 'none';
}): JSX.Element {
	const headingId = getHeadingId(children);

	return (
		<div
			css={[
				wrapperStyles.root,
				spacing === 'default' && levelToSpace[level],
				spacing === 'default' && wrapperStyles.reducedSpacingForFirstChild,
			]}
		>
			{headingId && <CopyLinkToHeadingButton headingId={headingId} />}

			<Heading size={levelToSize[level]} id={headingId ?? undefined}>
				{children}
			</Heading>
		</div>
	);
}
