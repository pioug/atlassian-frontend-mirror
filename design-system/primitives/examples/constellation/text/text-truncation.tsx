/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	box: {
		width: '220px',
	},
});

export default (): JSX.Element => {
	return (
		<Box xcss={styles.box}>
			<Stack space="space.300">
				<Text maxLines={1}>
					This text truncates within one line and displays an ellipsis at the end of the content to
					indicate truncation has occurred.
				</Text>
				<Text maxLines={2}>
					This text truncates within two lines and displays an ellipsis at the end of the content to
					indicate truncation has occurred.
				</Text>
				<Text maxLines={3}>
					This text truncates within three lines and displays an ellipsis at the end of the content
					to indicate truncation has occurred.
				</Text>
			</Stack>
		</Box>
	);
};
