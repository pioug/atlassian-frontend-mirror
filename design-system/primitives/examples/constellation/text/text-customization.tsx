import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	customStylesContainer: {
		width: '200px',
		borderWidth: token('border.width.indicator'),
		borderColor: token('color.border.accent.magenta'),
		borderStyle: 'solid',
	},
	customTextDecorationLine: { textDecorationLine: 'line-through' },
	customOverflowWrap: { overflowWrap: 'normal' },
});

export default () => {
	return (
		<Stack space="space.100">
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
