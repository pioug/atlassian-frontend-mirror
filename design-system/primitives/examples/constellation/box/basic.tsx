/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	box: {
		borderColor: token('color.border.discovery'),
		borderStyle: 'solid',
		borderRadius: '3px',
		borderWidth: token('border.width'),
	},
});

export default function Example() {
	return (
		<Box padding="space.400" backgroundColor="color.background.discovery" xcss={styles.box}></Box>
	);
}
