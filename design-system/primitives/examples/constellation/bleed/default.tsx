/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import PersonIcon from '@atlaskit/icon/core/person';
import { Bleed, Flex, Inline, Pressable, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const styles = cssMap({
	button: {
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		color: token('color.text.inverse'),
		borderRadius: token('radius.full'),
		borderWidth: token('border.width.selected'),
		borderColor: token('color.border.bold'),
		borderStyle: 'solid',
		backgroundColor: token('color.background.neutral.bold'),
		'&:hover': {
			position: 'relative',
			backgroundColor: token('color.background.neutral.bold.hovered'),
		},
	},

	nudge: {
		paddingInlineStart: token('space.050'),
	},
});

export default function Basic(): JSX.Element {
	return (
		<Stack space="space.100">
			<Inline>
				{['first', 'second', 'third', 'fourth'].map((key) => (
					<Pressable key={key} xcss={styles.button}>
						<Flex xcss={iconSpacingStyles.space050}>
							<PersonIcon label="An avatar" />
						</Flex>
					</Pressable>
				))}
			</Inline>
			<Inline xcss={styles.nudge}>
				{['first', 'second', 'third', 'fourth'].map((key) => (
					<Bleed inline="space.050" key={key}>
						<Pressable xcss={styles.button}>
							<Flex xcss={iconSpacingStyles.space050}>
								<PersonIcon label="An avatar" />
							</Flex>
						</Pressable>
					</Bleed>
				))}
			</Inline>
		</Stack>
	);
}
