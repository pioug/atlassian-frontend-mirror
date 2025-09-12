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
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
	},
	controls: {
		paddingBlockEnd: token('space.200'),
	},
});

export default () => {
	const [currentStep, setCurrentStep] = useState<'step-1' | 'step-2' | 'step-3' | undefined>(
		'step-1',
	);

	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<PopoverProvider>
					<PopoverTarget>
						<Box xcss={styles.target}>
							<Text>Target 1</Text>
						</Box>
					</PopoverTarget>
					<PopoverContent placement="right-end" isVisible={currentStep === 'step-1'}>
						<SpotlightCard testId="spotlight">
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
								<SpotlightStepCount>1 of 3</SpotlightStepCount>
								<SpotlightActions>
									<SpotlightPrimaryAction onClick={() => setCurrentStep('step-2')}>
										Next
									</SpotlightPrimaryAction>
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
					<PopoverContent placement="left-end" isVisible={currentStep === 'step-2'}>
						<SpotlightCard testId="spotlight">
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
								<SpotlightStepCount>2 of 3</SpotlightStepCount>
								<SpotlightActions>
									<SpotlightSecondaryAction onClick={() => setCurrentStep('step-1')}>
										Prev
									</SpotlightSecondaryAction>
									<SpotlightPrimaryAction onClick={() => setCurrentStep('step-3')}>
										Next
									</SpotlightPrimaryAction>
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
					<PopoverContent placement="right-end" isVisible={currentStep === 'step-3'}>
						<SpotlightCard testId="spotlight">
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
								<SpotlightStepCount>3 of 3</SpotlightStepCount>
								<SpotlightActions>
									<SpotlightSecondaryAction onClick={() => setCurrentStep('step-2')}>
										Prev
									</SpotlightSecondaryAction>
									<SpotlightPrimaryAction onClick={() => setCurrentStep(undefined)}>
										Done
									</SpotlightPrimaryAction>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>
			</div>
			<div css={styles.controls}>
				<Button onClick={() => setCurrentStep('step-1')}>Show Spotlight</Button>
			</div>
		</div>
	);
};
