/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const styles = cssMap({
	label: {
		display: 'grid',
		rowGap: token('space.100'),
		color: token('color.text'),
		font: token('font.body'),
	},
	input: {
		backgroundColor: token('color.background.input'),
		borderColor: token('color.border.input'),
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		boxShadow: 'none',
		color: token('color.text'),
		font: token('font.body'),
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		transition: token('motion.input.hovered'),
		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
		},
		'&:focus': {
			borderColor: token('color.border.focused'),
			boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.focused')}`,
			outline: 'none',
			transition: token('motion.input.focused'),
		},
	},
});

export default (): JSX.Element => (
	<label css={styles.label}>
		Email
		<input css={styles.input} type="email" />
	</label>
);
