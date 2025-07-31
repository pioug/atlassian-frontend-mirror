/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import { Spotlight } from '@atlaskit/spotlight';

const styles = cssMap({
	root: {
		padding: 'var(--ds-space-100)',
	},
});

export default function Basic() {
	return (
		<div css={styles.root}>
			<Spotlight testId="spotlight">
				<Text color="color.text.inverse">Hello</Text>
			</Spotlight>
		</div>
	);
}
