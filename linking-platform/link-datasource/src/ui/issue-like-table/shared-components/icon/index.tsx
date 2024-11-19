import React from 'react';

import { Box, Flex, Inline, xcss } from '@atlaskit/primitives';

const labelStyles = xcss({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	width: '100%',
});

interface SharedIconComponentProps {
	/**
	 * URL or SVG for the priority icon
	 */
	iconUrl: string;
	/**
	 * Text that labels the icon. Will not be capitalised.
	 */
	text?: string;
	/**
	 * Label.
	 * Used for icon alt.
	 */
	label?: string;

	testId: string;
}

/**
 * Renders a icon and label.
 * If the text is undefined, render the capitalised label.
 */
export function SharedIconComponent({ iconUrl, label, text, testId }: SharedIconComponentProps) {
	const displayText =
		text === undefined || text === ''
			? label
				? label.charAt(0).toUpperCase() + label.slice(1)
				: undefined
			: text;
	return (
		<Flex gap="space.100" alignItems="center" testId={testId}>
			<Inline>
				<img
					src={iconUrl}
					alt={label}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ minWidth: '24px', maxWidth: '24px' }} // having just width: '24px' shrinks it when table width is reduced
				/>
			</Inline>
			{displayText && (
				<Box xcss={labelStyles} testId={`${testId}-text`}>
					{displayText}
				</Box>
			)}
		</Flex>
	);
}
