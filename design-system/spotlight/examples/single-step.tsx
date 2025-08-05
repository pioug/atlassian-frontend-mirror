/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import {
	Spotlight,
	SpotlightActions,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
} from '@atlaskit/spotlight';

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
				<SpotlightFooter>
					<SpotlightActions>
						<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
					</SpotlightActions>
				</SpotlightFooter>
			</Spotlight>
		</div>
	);
}
