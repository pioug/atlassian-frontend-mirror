/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import Portal from '@atlaskit/portal';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		marginBlockStart: token('space.1000'),
	},
	figcaption: {
		position: 'absolute',
		backgroundColor: token('color.background.neutral'),
		insetBlockEnd: token('space.0'),
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	figure: {
		position: 'absolute',
		border: `${token('border.width')} solid ${token('color.blanket')}`,
		filter: 'drop-shadow(-12px 12px 8px)',
	},
	topSquare: {
		width: '372px',
		height: '482px',
		backgroundColor: token('color.background.accent.purple.bolder'),
	},
	bottomSquare: {
		width: '372px',
		height: '492px',
		backgroundColor: token('color.background.accent.blue.subtler'),
	},
	topSquarePosition: {
		insetBlockStart: token('space.0'),
		insetInlineStart: '256px',
	},
	topSquareIndex: {
		zIndex: 1,
	},
	bottomSquareIndex: {
		zIndex: 1000,
	},
});

const PortalStackingContextExample = (): JSX.Element => {
	return (
		<Box xcss={styles.container}>
			<Portal zIndex={100}>
				<figure css={[styles.figure, styles.bottomSquareIndex]}>
					<div css={styles.bottomSquare} />
					<figcaption css={styles.figcaption}>
						I am a bottom square. I appear below because my z-index is lower. My child z-index is
						only relevant in my stacking context.
					</figcaption>
				</figure>
			</Portal>
			<Portal zIndex={200}>
				<figure css={[styles.figure, styles.topSquarePosition, styles.topSquareIndex]}>
					<div css={styles.topSquare} />
					<figcaption css={styles.figcaption}>
						I am a top square. I appear above because my z-index is higher. My sibling's child
						z-index is only relevant in it's parent stacking context.
					</figcaption>
				</figure>
			</Portal>
		</Box>
	);
};

export default PortalStackingContextExample;
