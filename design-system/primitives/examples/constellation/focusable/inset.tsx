/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Focusable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	textfield: {
		display: 'block',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		border: 'none',
		borderRadius: token('radius.small'),
		marginBlock: token('space.150'),
		marginInline: 0,
		cursor: 'pointer',
		borderWidth: token('border.width.selected'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
});

export default () => {
	return (
		<div css={styles.container}>
			<Focusable
				as="input"
				isInset
				testId="input"
				xcss={styles.textfield}
				placeholder="Native Textfield (Inset)"
			/>
		</div>
	);
};
