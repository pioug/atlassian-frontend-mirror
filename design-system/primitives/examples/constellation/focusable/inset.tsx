/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Focusable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	textfield: {
		display: 'block',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		border: 'none',
		borderRadius: token('radius.small'),
		marginBlock: token('space.150'),
		marginInline: 0,
		cursor: 'pointer',
		borderWidth: token('border.width.outline'),
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
