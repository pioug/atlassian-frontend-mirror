/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Image from '@atlaskit/image';
import { Text } from '@atlaskit/primitives/compiled';
import { SpotlightActions } from '@atlaskit/spotlight/actions';
import { SpotlightBody } from '@atlaskit/spotlight/body';
import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightControls } from '@atlaskit/spotlight/controls';
import { SpotlightDismissControl } from '@atlaskit/spotlight/dismiss-control';
import { SpotlightFooter } from '@atlaskit/spotlight/footer';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { SpotlightHeadline } from '@atlaskit/spotlight/headline';
import { SpotlightMedia } from '@atlaskit/spotlight/media';
import { SpotlightPrimaryAction } from '@atlaskit/spotlight/primary-action';
import { SpotlightSecondaryAction } from '@atlaskit/spotlight/secondary-action';
import { SpotlightStepCount } from '@atlaskit/spotlight/step-count';

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

export default (): JSX.Element => {
	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<SpotlightCard testId="spotlight-step-1">
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
				</SpotlightCard>

				<SpotlightCard testId="spotlight-step-2">
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
							<SpotlightSecondaryAction>Back</SpotlightSecondaryAction>
							<SpotlightPrimaryAction>Next</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</SpotlightCard>

				<SpotlightCard testId="spotlight-step-3">
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
							<SpotlightSecondaryAction>Back</SpotlightSecondaryAction>
							<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</SpotlightCard>
			</div>
		</div>
	);
};
