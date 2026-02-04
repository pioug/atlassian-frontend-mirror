/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import {
	PopoverContent,
	PopoverProvider,
	PopoverTarget,
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
	SpotlightStepCount,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		gap: token('space.300'),
	},
	target: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
	},
});

const Example = (): JSX.Element => {
	const [currentStep, setCurrentStep] = useState<number>(0);

	const dismiss = () => setCurrentStep(0);
	const back = () => setCurrentStep(Math.max(currentStep - 1, 1));
	const next = () => setCurrentStep(Math.min(currentStep + 1, 3));
	const done = () => setCurrentStep(0);

	return (
		<div css={styles.root}>
			<PopoverProvider>
				<PopoverTarget>
					<Box xcss={styles.target}>
						<Text>Target 1</Text>
					</Box>
				</PopoverTarget>
				<PopoverContent dismiss={dismiss} placement="right-end" isVisible={currentStep === 1}>
					<SpotlightCard testId="spotlight">
						<SpotlightHeader>
							<SpotlightHeadline>Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl onClick={dismiss} />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightBody>
							<Text>Brief and direct textual content to elaborate on the intent.</Text>
						</SpotlightBody>
						<SpotlightFooter>
							<SpotlightStepCount>1 of 3</SpotlightStepCount>
							<SpotlightActions>
								<SpotlightPrimaryAction onClick={next}>Next</SpotlightPrimaryAction>
							</SpotlightActions>
						</SpotlightFooter>
					</SpotlightCard>
				</PopoverContent>
			</PopoverProvider>

			<PopoverProvider>
				<PopoverTarget>
					<Box xcss={styles.target}>
						<Text>Target 2</Text>
					</Box>
				</PopoverTarget>
				<PopoverContent dismiss={dismiss} placement="left-end" isVisible={currentStep === 2}>
					<SpotlightCard testId="spotlight">
						<SpotlightHeader>
							<SpotlightHeadline>Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl onClick={dismiss} />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightBody>
							<Text>Brief and direct textual content to elaborate on the intent.</Text>
						</SpotlightBody>
						<SpotlightFooter>
							<SpotlightStepCount>2 of 3</SpotlightStepCount>
							<SpotlightActions>
								<SpotlightSecondaryAction onClick={back}>Back</SpotlightSecondaryAction>
								<SpotlightPrimaryAction onClick={next}>Next</SpotlightPrimaryAction>
							</SpotlightActions>
						</SpotlightFooter>
					</SpotlightCard>
				</PopoverContent>
			</PopoverProvider>

			<PopoverProvider>
				<PopoverTarget>
					<Box xcss={styles.target}>
						<Text>Target 3</Text>
					</Box>
				</PopoverTarget>
				<PopoverContent dismiss={dismiss} placement="right-end" isVisible={currentStep === 3}>
					<SpotlightCard testId="spotlight">
						<SpotlightHeader>
							<SpotlightHeadline>Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl onClick={dismiss} />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightBody>
							<Text>Brief and direct textual content to elaborate on the intent.</Text>
						</SpotlightBody>
						<SpotlightFooter>
							<SpotlightStepCount>3 of 3</SpotlightStepCount>
							<SpotlightActions>
								<SpotlightSecondaryAction onClick={back}>Back</SpotlightSecondaryAction>
								<SpotlightPrimaryAction onClick={done}>Done</SpotlightPrimaryAction>
							</SpotlightActions>
						</SpotlightFooter>
					</SpotlightCard>
				</PopoverContent>
			</PopoverProvider>

			<Button onClick={() => setCurrentStep(1)}>Restart Tour</Button>
		</div>
	);
};

export default Example;
