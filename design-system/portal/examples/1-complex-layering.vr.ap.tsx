import React, { type ReactNode, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import Flag from '@atlaskit/flag/flag';
import FlagGroup from '@atlaskit/flag/flag-group';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import InlineDialog from '@atlaskit/inline-dialog/inline-dialog';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const TooltipButton = ({
	children,
	onClick,
	id,
	testId,
}: {
	children: ReactNode;
	onClick: () => void;
	id?: string;
	testId?: string;
}) => (
	<div>
		<Tooltip content="Click me">
			<Button id={id} testId={testId} onClick={onClick}>
				{children}
			</Button>
		</Tooltip>
	</div>
);

type SpotlightProps = {
	stepOne: ReactNode;
	stepTwo: ReactNode;
	stepThree: ReactNode;
	isOpen: boolean;
	onFinish: () => void;
};

function ThreeStepSpotlight(props: SpotlightProps) {
	const [step, setStep] = useState(1);
	const { stepOne, stepTwo, stepThree, isOpen, onFinish } = props;

	const next = () => {
		const nextStep = step + 1;
		if (nextStep > 3) {
			setStep(1);
			onFinish();
		} else {
			setStep(nextStep);
		}
	};

	return (
		<SpotlightManager>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					justifyContent: 'space-between',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: token('space.300'),
				}}
			>
				<SpotlightTarget name="1">{stepOne}</SpotlightTarget>
				<SpotlightTarget name="2">{stepTwo}</SpotlightTarget>
				<SpotlightTarget name="3">{stepThree}</SpotlightTarget>
			</div>
			<SpotlightTransition>
				{isOpen && (
					<Spotlight
						actions={[{ onClick: next, text: step === 3 ? 'Close' : 'Next' }]}
						heading={`Here is step ${step} of 3`}
						key={`${step}`}
						target={`${step}`}
					/>
				)}
			</SpotlightTransition>
		</SpotlightManager>
	);
}

type ModalProps = {
	onOpen: () => void;
	onClose: () => void;
};

function Modal(props: ModalProps) {
	const [onboardingOpen, setOnboardingOpen] = useState(false);
	const [inlineOpen, setInlineOpen] = useState(false);
	const [flags, setFlags] = useState<number[]>([]);

	const toggleOnboarding = (onboardingOpen: boolean) => setOnboardingOpen(onboardingOpen);

	const toggleInline = (inlineOpen: boolean) => setInlineOpen(inlineOpen);

	const addFlag = () => setFlags([flags.length, ...flags]);

	const removeFlag = (id: number | string) => setFlags(flags.filter((v) => v !== id));

	const { onClose, onOpen } = props;

	return (
		<React.Fragment>
			<ModalDialog onClose={onClose} testId="modal">
				<ModalHeader hasCloseButton>
					<ModalTitle>Modal dialog</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<p>This dialog has three great features:</p>
					<ThreeStepSpotlight
						isOpen={onboardingOpen}
						onFinish={() => toggleOnboarding(false)}
						stepOne={
							<TooltipButton onClick={() => toggleOnboarding(true)} id={'showOnboardingBtn'}>
								Show onboarding
							</TooltipButton>
						}
						stepTwo={
							<InlineDialog content="This button is very nice" isOpen={inlineOpen}>
								<TooltipButton onClick={() => toggleInline(!inlineOpen)}>
									Show an inline dialog
								</TooltipButton>
							</InlineDialog>
						}
						stepThree={
							<TooltipButton onClick={() => addFlag()} id={'showFlagBtn'}>
								Show an flag
							</TooltipButton>
						}
					/>
				</ModalBody>
				<ModalFooter>
					<Button appearance="subtle" onClick={onOpen}>
						Open another
					</Button>
					<Button appearance="primary" onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalDialog>
			<FlagGroup onDismissed={(id: number | string) => removeFlag(id)}>
				{flags.map((id) => (
					<Flag
						id={id}
						key={`${id}`}
						icon={
							<Flex xcss={iconSpacingStyles.space050}>
								<EmojiIcon label="Smiley face" />
							</Flex>
						}
						title={`${id + 1}: Whoa a new flag!`}
					/>
				))}
			</FlagGroup>
		</React.Fragment>
	);
}

function App(): React.JSX.Element {
	const [modals, setModals] = useState<number[]>([]);

	const nextId = modals.length + 1;

	return (
		<React.Fragment>
			<ModalTransition>
				{modals.map((id: number) => (
					<Modal
						key={id}
						onOpen={() => setModals([...modals, nextId])}
						onClose={() => setModals(modals.filter((i: number) => i !== id))}
					/>
				))}
			</ModalTransition>
			<p>
				This example shows off all components that rely on portalling and layering to appear in the
				expected order.
			</p>
			<TooltipButton id={'openDialogBtn'} testId="dialog-trigger" onClick={() => setModals([1])}>
				Open Dialog
			</TooltipButton>
		</React.Fragment>
	);
}

export default App;
