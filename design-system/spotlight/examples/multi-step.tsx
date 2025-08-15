/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Image from '@atlaskit/image';
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
	SpotlightMedia,
	SpotlightPrimaryAction,
	SpotlightSecondaryAction,
	SpotlightStepCount,
} from '@atlaskit/spotlight';

import ExampleImage from './assets/295x135.png';

const styles = cssMap({
	root: {
		height: '100vh',
		maxHeight: '100vh',
		width: '100vw',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
	},
	content: {
		width: '70vw',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
});

export default () => {
	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<Spotlight testId="spotlight-step-1">
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
						<SpotlightStepCount>1 of 3</SpotlightStepCount>
						<SpotlightActions>
							<SpotlightPrimaryAction>Next</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</Spotlight>

				<Spotlight testId="spotlight-step-2">
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
						<SpotlightStepCount>2 of 3</SpotlightStepCount>
						<SpotlightActions>
							<SpotlightSecondaryAction>Prev</SpotlightSecondaryAction>
							<SpotlightPrimaryAction>Next</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</Spotlight>

				<Spotlight testId="spotlight-step-3">
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
						<SpotlightStepCount>2 of 3</SpotlightStepCount>
						<SpotlightActions>
							<SpotlightSecondaryAction>Prev</SpotlightSecondaryAction>
							<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</Spotlight>
			</div>
		</div>
	);
};
