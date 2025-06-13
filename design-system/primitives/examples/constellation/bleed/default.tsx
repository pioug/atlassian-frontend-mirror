/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import PersonIcon from '@atlaskit/icon/core/migration/person';
import { Bleed, Inline, Pressable, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	button: {
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		color: token('color.text.inverse'),
		borderRadius: token('border.radius.circle'),
		borderWidth: token('border.width.outline'),
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

export default function Basic() {
	return (
		<Stack space="space.100">
			<Inline>
				{['first', 'second', 'third', 'fourth'].map((key) => (
					<Pressable key={key} xcss={styles.button}>
						<PersonIcon label="An avatar" LEGACY_size="medium" spacing="spacious" />
					</Pressable>
				))}
			</Inline>
			<Inline xcss={styles.nudge}>
				{['first', 'second', 'third', 'fourth'].map((key) => (
					<Bleed inline="space.050" key={key}>
						<Pressable xcss={styles.button}>
							<PersonIcon label="An avatar" LEGACY_size="medium" spacing="spacious" />
						</Pressable>
					</Bleed>
				))}
			</Inline>
		</Stack>
	);
}
