/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import {
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
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
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
		minHeight: '400px',
	},
});

export default function Basic(): JSX.Element {
	return (
		<div css={styles.root}>
			<SpotlightCard testId="spotlight">
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
						<SpotlightSecondaryAction>Back</SpotlightSecondaryAction>
						<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
					</SpotlightActions>
				</SpotlightFooter>
			</SpotlightCard>
		</div>
	);
}
