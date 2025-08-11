/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import {
	PopoverContent,
	PopoverProvider,
	PopoverTarget,
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
	TourContext,
	TourContextProvider,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

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
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.300'),
	},
	target: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
	},
	controls: {
		paddingBlockEnd: token('space.200'),
	},
});

export default () => {
	return (
		<TourContextProvider>
			<App />
		</TourContextProvider>
	);
};

const App = () => {
	const { setCurrentStep } = useContext(TourContext);

	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<Step1 />
				<Step2 />
				<Step3 />
			</div>
			<div css={styles.controls}>
				<Button onClick={() => setCurrentStep(1)}>Restart tour</Button>
			</div>
		</div>
	);
};

const Step1 = () => {
	const { currentStep, setCurrentStep, next } = useContext(TourContext);

	return (
		<PopoverProvider>
			<PopoverTarget>
				<Box xcss={styles.target}>
					<Text>Target 1</Text>
				</Box>
			</PopoverTarget>
			<PopoverContent placement="right-end" isVisible={currentStep === 1}>
				<Spotlight testId="spotlight">
					<SpotlightHeader>
						<SpotlightHeadline>Headline</SpotlightHeadline>
						<SpotlightControls>
							<SpotlightDismissControl onClick={() => setCurrentStep(undefined)} />
						</SpotlightControls>
					</SpotlightHeader>
					<SpotlightBody>
						<Text>Brief and direct textual content to elaborate on the intent.</Text>
					</SpotlightBody>
					<SpotlightFooter>
						<SpotlightActions>
							<SpotlightPrimaryAction onClick={next}>Next</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</Spotlight>
			</PopoverContent>
		</PopoverProvider>
	);
};

const Step2 = () => {
	const { currentStep, setCurrentStep, next, prev } = useContext(TourContext);

	return (
		<PopoverProvider>
			<PopoverTarget>
				<Box xcss={styles.target}>
					<Text>Target 2</Text>
				</Box>
			</PopoverTarget>
			<PopoverContent placement="left-end" isVisible={currentStep === 2}>
				<Spotlight testId="spotlight">
					<SpotlightHeader>
						<SpotlightHeadline>Headline</SpotlightHeadline>
						<SpotlightControls>
							<SpotlightDismissControl onClick={() => setCurrentStep(undefined)} />
						</SpotlightControls>
					</SpotlightHeader>
					<SpotlightBody>
						<Text>Brief and direct textual content to elaborate on the intent.</Text>
					</SpotlightBody>
					<SpotlightFooter>
						<SpotlightActions>
							<SpotlightSecondaryAction onClick={prev}>Prev</SpotlightSecondaryAction>
							<SpotlightPrimaryAction onClick={next}>Next</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</Spotlight>
			</PopoverContent>
		</PopoverProvider>
	);
};

const Step3 = () => {
	const { currentStep, setCurrentStep, prev } = useContext(TourContext);

	return (
		<PopoverProvider>
			<PopoverTarget>
				<Box xcss={styles.target}>
					<Text>Target 3</Text>
				</Box>
			</PopoverTarget>
			<PopoverContent placement="right-end" isVisible={currentStep === 3}>
				<Spotlight testId="spotlight">
					<SpotlightHeader>
						<SpotlightHeadline>Headline</SpotlightHeadline>
						<SpotlightControls>
							<SpotlightDismissControl onClick={() => setCurrentStep(undefined)} />
						</SpotlightControls>
					</SpotlightHeader>
					<SpotlightBody>
						<Text>Brief and direct textual content to elaborate on the intent.</Text>
					</SpotlightBody>
					<SpotlightFooter>
						<SpotlightActions>
							<SpotlightSecondaryAction onClick={prev}>Prev</SpotlightSecondaryAction>
							<SpotlightPrimaryAction onClick={() => setCurrentStep(undefined)}>
								Done
							</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</Spotlight>
			</PopoverContent>
		</PopoverProvider>
	);
};
