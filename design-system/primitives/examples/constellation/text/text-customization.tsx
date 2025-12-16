import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	customStylesContainer: {
		width: '200px',
		borderWidth: token('border.width.selected'),
		borderColor: token('color.border.accent.magenta'),
		borderStyle: 'solid',
	},
	customTextDecorationLine: { textDecorationLine: 'line-through' },
	customOverflowWrap: { overflowWrap: 'normal' },
	customTabularNums: { fontVariantNumeric: 'tabular-nums' },
	customSlashedZero: { fontVariantNumeric: 'slashed-zero' },
});

export default (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			<Text xcss={styles.customTabularNums}>Tabular numbers: 1234567890</Text>
			<Text xcss={styles.customSlashedZero}>Slashed zero: 1234567890</Text>
			<Text xcss={styles.customTextDecorationLine}>Striked through text</Text>
			<Inline space="space.100">
				<Box xcss={styles.customStylesContainer}>
					<Text>
						Default overflow wrap with a really long word
						Vierhundertvierundvierzigtausendvierhundertvierundvierzig that can break to avoid
						overflowing its container.
					</Text>
				</Box>
				<Box xcss={styles.customStylesContainer}>
					<Text xcss={styles.customOverflowWrap}>
						Custom overflow wrap with a really long word
						Vierhundertvierundvierzigtausendvierhundertvierundvierzig that overflows its container.
					</Text>
				</Box>
			</Inline>
		</Stack>
	);
};
