/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Spotlight, SpotlightHeader, SpotlightHeadline } from '@atlaskit/spotlight';

const styles = cssMap({
	root: {
		padding: 'var(--ds-space-100)',
	},
});

export default function Basic() {
	return (
		<div css={styles.root}>
			<Spotlight testId="spotlight">
				<SpotlightHeader>
					<SpotlightHeadline>Headline</SpotlightHeadline>
				</SpotlightHeader>
			</Spotlight>
		</div>
	);
}
