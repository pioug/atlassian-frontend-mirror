/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Link from '@atlaskit/link';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	container: {
		width: '515px',
	},
});

export default function IconWrappingExample(): JSX.Element {
	return (
		// Both link text and icon should be `color.link.visited`.
		<Box xcss={styles.container}>
			<Link href="https://www.atlassian.com" target="_blank">
				I am a long link with an icon, but the icon does not wrap onto a new line by itself
			</Link>
		</Box>
	);
}
