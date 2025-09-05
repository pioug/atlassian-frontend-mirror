/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Stack } from '@atlaskit/primitives/compiled';
import Text from '@atlaskit/primitives/text';
import Tile from '@atlaskit/tile';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: { width: '400px' },
	shrinkTestWidth: {
		width: '10px',
		display: 'flex',
		flexDirection: 'row',
	},
	shrinkTestHeight: {
		height: '10px',
		display: 'flex',
		flexDirection: 'column',
	},
	growTestRow: {
		width: '300px',
		height: '60px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	growTestColumn: {
		width: '60px',
		height: '300px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	justifySpaceBetween: {
		justifyContent: 'space-between',
	},
	flexGrow1: {
		flexGrow: 1,
	},
	borderContainer: {
		borderWidth: token('border.width'),
		borderStyle: 'dashed',
		borderColor: token('color.border.bold'),
	},
});

/**
 * This example ensures Tile behaves correctly in a flex container, maintaining its aspect ratio and not shrinking or growing.
 */
export default function TestingFlex() {
	return (
		<Stack space="space.200" xcss={styles.root}>
			<Heading size="small">flexGrow: 0 tests (containers with extra space)</Heading>

			<Text>Row with extra space - tiles should NOT grow:</Text>
			<div css={[styles.growTestRow, styles.borderContainer]}>
				<Tile label="" backgroundColor="color.background.accent.blue.subtler" size="medium">
					👤
				</Tile>
				<Tile label="" backgroundColor="color.background.accent.green.subtler" size="small">
					📝
				</Tile>
				<Tile label="" backgroundColor="color.background.accent.purple.subtler" size="large">
					⚡
				</Tile>
			</div>

			<Text>Row with space-between - tiles should maintain size:</Text>
			<div css={[styles.growTestRow, styles.justifySpaceBetween, styles.borderContainer]}>
				<Tile label="" backgroundColor="color.background.accent.orange.subtler" size="medium">
					🎯
				</Tile>
				<Tile label="" backgroundColor="color.background.accent.teal.subtler" size="medium">
					🚀
				</Tile>
			</div>

			<Text>Column with extra space - tiles should NOT grow:</Text>
			<div css={[styles.growTestColumn, styles.borderContainer]}>
				<Tile label="" backgroundColor="color.background.accent.lime.subtler" size="small">
					🌟
				</Tile>
				<Tile label="" backgroundColor="color.background.accent.magenta.subtler" size="medium">
					💎
				</Tile>
				<Tile label="" backgroundColor="color.background.accent.gray.subtler" size="small">
					🔥
				</Tile>
			</div>

			<Text>Mixed with flex-grow sibling - tile should maintain size:</Text>
			<div css={[styles.growTestRow, styles.borderContainer]}>
				<Tile label="" backgroundColor="color.background.accent.red.subtlest" size="medium">
					🎨
				</Tile>
				<div css={[styles.flexGrow1, styles.borderContainer]}>
					This div has flex-grow: 1 and should expand to fill space
				</div>
				<Tile label="" backgroundColor="color.background.accent.blue.subtlest" size="medium">
					🎪
				</Tile>
			</div>

			<Stack space="space.500">
				<Stack space="space.200">
					<Heading size="small">flexShrink: 0 tests (containers too small)</Heading>

					<Text>Container too short - tile should NOT shrink:</Text>
					<div css={[styles.shrinkTestHeight, styles.borderContainer]}>
						<Tile label="" backgroundColor="color.background.accent.orange.subtler" size="xlarge">
							🥹
						</Tile>
					</div>
				</Stack>
				<Stack space="space.200">
					<Text>Container too narrow - tile should NOT shrink:</Text>
					<div css={[styles.shrinkTestWidth, styles.borderContainer]}>
						<Tile label="" backgroundColor="color.background.accent.red.subtler" size="xlarge">
							🙊
						</Tile>
					</div>
				</Stack>
			</Stack>
		</Stack>
	);
}
