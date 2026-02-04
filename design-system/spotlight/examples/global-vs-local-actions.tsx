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

export default (): JSX.Element => {
	const [currentStep, setCurrentStep] = useState<number>(0);

	const globalDismiss = () => {
		console.log('globalDismiss');
		setCurrentStep(0);
	};
	const globalBack = () => {
		console.log('globalBack');
		setCurrentStep(Math.max(currentStep - 1, 1));
	};
	const globalNext = () => {
		console.log('globalNext');
		setCurrentStep(Math.min(currentStep + 1, 3));
	};
	const globalDone = () => {
		console.log('globalDone');
		setCurrentStep(0);
	};

	const localDismiss = () => {
		console.log('localDismiss');
		setCurrentStep(0);
	};
	const localBack = () => {
		console.log('localBack');
		setCurrentStep(Math.max(currentStep - 1, 1));
	};
	const locallNext = () => {
		console.log('locallNext');
		setCurrentStep(Math.min(currentStep + 1, 3));
	};
	const locallDone = () => {
		console.log('locallDone');
		setCurrentStep(0);
	};

	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<PopoverProvider>
					<PopoverTarget>
						<Box xcss={styles.target}>
							<Text>Target 1</Text>
						</Box>
					</PopoverTarget>
					<PopoverContent
						dismiss={globalDismiss}
						next={globalNext}
						placement="right-end"
						isVisible={currentStep === 1}
					>
						<SpotlightCard testId="spotlight">
							<SpotlightHeader>
								<SpotlightHeadline>Global Actions</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>
									This step uses only global actions.
									<ul>
										<li>
											SpotlightDismissControl will automatically use the PopoverContent.dismiss prop
										</li>
										<li>
											SpotlightPrimaryAction will automatically use the PopoverContent.next prop
										</li>
									</ul>
								</Text>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightStepCount>1 of 3</SpotlightStepCount>
								<SpotlightActions>
									<SpotlightPrimaryAction>Next</SpotlightPrimaryAction>
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
					<PopoverContent
						dismiss={globalDismiss}
						placement="left-end"
						isVisible={currentStep === 2}
					>
						<SpotlightCard testId="spotlight">
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl onClick={localDismiss} />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>
									This step uses only local actions.
									<ul>
										<li>
											SpotlightDismissControl will use it's onClick prop (even though dismiss is
											passed to PopoverContent)
										</li>
										<li>SpotlightSecondaryAction will use it's onClick prop</li>
										<li>SpotlightPrimaryAction will use it's onClick prop</li>
									</ul>
								</Text>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightStepCount>2 of 3</SpotlightStepCount>
								<SpotlightActions>
									<SpotlightSecondaryAction onClick={localBack}>Back</SpotlightSecondaryAction>
									<SpotlightPrimaryAction onClick={locallNext}>Next</SpotlightPrimaryAction>
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
					<PopoverContent
						dismiss={globalDismiss}
						done={globalDone}
						back={globalBack}
						placement="right-end"
						isVisible={currentStep === 3}
					>
						<SpotlightCard testId="spotlight">
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl onClick={localDismiss} />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>
									This step overrides all global actions with local actions.
									<ul>
										<li>
											SpotlightDismissControl will use it's onClick prop (even though dismiss is
											passed to PopoverContent)
										</li>
										<li>
											SpotlightSecondaryAction will use it's onClick prop (even though back is
											passed to PopoverContent)
										</li>
										<li>
											SpotlightPrimaryAction will use it's onClick prop (even though done is passed
											to PopoverContent)
										</li>
									</ul>
								</Text>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightStepCount>3 of 3</SpotlightStepCount>
								<SpotlightActions>
									<SpotlightSecondaryAction onClick={localBack}>Back</SpotlightSecondaryAction>
									<SpotlightPrimaryAction onClick={locallDone}>Done</SpotlightPrimaryAction>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>
			</div>
			<div css={styles.controls}>
				<Button onClick={() => setCurrentStep(1)}>Show Spotlight</Button>
			</div>
		</div>
	);
};
