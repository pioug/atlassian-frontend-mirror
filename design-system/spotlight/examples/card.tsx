/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Image from '@atlaskit/image';
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
	SpotlightMedia,
	SpotlightPrimaryAction,
	SpotlightSecondaryAction,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

import ExampleImage from './assets/295x135.png';

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
				<SpotlightMedia>
					<Image src={ExampleImage} alt="placeholder" />
				</SpotlightMedia>
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
