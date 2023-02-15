/** @jsx jsx */
import { Fragment, type ReactNode, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import Flag, { FlagGroup } from '@atlaskit/flag';
import EmojiIcon from '@atlaskit/icon/glyph/emoji';
import InlineDialog from '@atlaskit/inline-dialog';
import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@atlaskit/onboarding';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const tooltipContainerStyles = css({
  backgroundColor: token('color.background.neutral', 'white'),
});

const TooltipButton = ({
  children,
  onClick,
  id,
}: {
  children: ReactNode;
  onClick: () => void;
  id?: string;
}) => (
  <div css={tooltipContainerStyles}>
    <Tooltip content="Click me">
      <Button id={id} onClick={onClick}>
        {children}
      </Button>
    </Tooltip>
  </div>
);

const spotlightContainerStyles = css({
  display: 'flex',
  padding: token('space.300', '24px'),
  justifyContent: 'space-between',
});

type SpotlightProps = {
  stepOne: ReactNode;
  stepTwo: ReactNode;
  stepThree: ReactNode;
  isOpen: boolean;
  onFinish: () => void;
};

const ThreeStepSpotlight = (props: SpotlightProps) => {
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
      <div css={spotlightContainerStyles}>
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
};

type ModalProps = {
  onClose: () => void;
};

const Modal = (props: ModalProps) => {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [inlineOpen, setInlineOpen] = useState(false);
  const [flags, setFlags] = useState<number[]>([]);

  const toggleOnboarding = (onboardingOpen: boolean) =>
    setOnboardingOpen(onboardingOpen);

  const toggleInline = (inlineOpen: boolean) => setInlineOpen(inlineOpen);

  const addFlag = () => setFlags([flags.length, ...flags]);

  const removeFlag = (id: number | string) =>
    setFlags(flags.filter((v) => v !== id));

  const { onClose } = props;

  return (
    <Fragment>
      <ModalDialog onClose={onClose} testId="modal">
        <ModalHeader>
          <ModalTitle>Modal dialog</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>This dialog has three great features:</p>
          <ThreeStepSpotlight
            isOpen={onboardingOpen}
            onFinish={() => toggleOnboarding(false)}
            stepOne={
              <TooltipButton
                onClick={() => toggleOnboarding(true)}
                id={'showOnboardingBtn'}
              >
                Show onboarding
              </TooltipButton>
            }
            stepTwo={
              <InlineDialog
                content="This button is very nice"
                isOpen={inlineOpen}
              >
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
          <Button appearance="primary" autoFocus onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalDialog>
      <FlagGroup onDismissed={(id: number | string) => removeFlag(id)}>
        {flags.map((id) => (
          <Flag
            id={id}
            key={`${id}`}
            icon={<EmojiIcon label="Smiley face" />}
            title={`${id + 1}: Whoa a new flag!`}
          />
        ))}
      </FlagGroup>
    </Fragment>
  );
};

const PortalComplexLayeringExample = () => {
  const [modals, setModals] = useState<number[]>([]);

  return (
    <Fragment>
      <ModalTransition>
        {modals.map((id: number) => (
          <Modal
            key={id}
            onClose={() => setModals(modals.filter((i: number) => i !== id))}
          />
        ))}
      </ModalTransition>
      <TooltipButton id={'openDialogBtn'} onClick={() => setModals([1])}>
        Open Dialog
      </TooltipButton>
    </Fragment>
  );
};

export default PortalComplexLayeringExample;
