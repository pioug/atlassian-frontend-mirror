/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import {
	Spotlight,
	SpotlightActions,
	SpotlightBody,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
	SpotlightSecondaryAction,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingTop: token('space.400'),
		paddingRight: token('space.400'),
		paddingBottom: token('space.400'),
		paddingLeft: token('space.400'),
		minHeight: '400px',
	},
});

export default function Basic() {
	return (
		<div css={styles.root}>
			<Spotlight testId="spotlight">
				<SpotlightHeader>
					<SpotlightHeadline>Headline</SpotlightHeadline>
					<SpotlightControls>
						<SpotlightDismissControl />
					</SpotlightControls>
				</SpotlightHeader>
				<SpotlightBody>
					<Text>Brief and direct textual content to elaborate on the intent.</Text>
				</SpotlightBody>
				<SpotlightFooter>
					<SpotlightActions>
						<SpotlightSecondaryAction>Prev</SpotlightSecondaryAction>
						<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
					</SpotlightActions>
				</SpotlightFooter>
			</Spotlight>
		</div>
	);
}
