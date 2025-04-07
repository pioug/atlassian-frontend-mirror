/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
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
					alt={label}
					css={fg('platform-linking-visual-refresh-sllv') && styles.iconStyles}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={
						fg('platform-linking-visual-refresh-sllv') ? {} : { minWidth: '24px', maxWidth: '24px' }
					} // having just width: '24px' shrinks it when table width is reduced
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
