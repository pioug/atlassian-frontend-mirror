/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { Box, Flex, Inline } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	labelStyles: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		width: '100%',
	},
	iconStyles: {
		maxWidth: '16px',
		minWidth: '16px',
	},
});

interface SharedIconComponentProps {
	/**
	 * URL or SVG for the priority icon
	 */
	iconUrl: string;
	/**
	 * Label.
	 * Used for icon alt.
	 */
	label?: string;
	testId: string;
	/**
	 * Text that labels the icon. Will not be capitalised.
	 */
	text?: string;
}

/**
 * Renders a icon and text label.
 * If the text is undefined, will not render the text label.
 */
export function SharedIconComponent({
	iconUrl,
	label = '',
	text,
	testId,
}: SharedIconComponentProps) {
	return (
		<Flex gap="space.100" alignItems="center" testId={testId}>
			<Inline>
				<img
					src={iconUrl}
					alt={label?.toLowerCase() !== text?.toLowerCase() ? label : ''}
					css={styles.iconStyles}
				/>
			</Inline>
			{text && (
				<Box xcss={styles.labelStyles} testId={`${testId}-text`}>
					{text}
				</Box>
			)}
		</Flex>
	);
}
