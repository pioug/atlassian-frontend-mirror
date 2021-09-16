/* eslint-disable react/no-multi-comp */
import React, { ReactNode, useState } from 'react';

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
import Tooltip from '@atlaskit/tooltip';

const TooltipButton = ({
  children,
  onClick,
  id,
}: {
  children: ReactNode;
  onClick: () => void;
  id?: string;
}) => (
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  <div style={{ backgroundColor: 'white' }}>
    <Tooltip content="Click me">
      <Button id={id} onClick={onClick}>
        {children}
      </Button>
    </Tooltip>
  </div>
);

type SpotlightProps = {
  stepOne: ReactNode;
  stepTwo: ReactNode;
  stepThree: ReactNode;
  open: boolean;
  onFinish: () => void;
};

function ThreeStepSpotlight(props: SpotlightProps) {
  const [step, setStep] = useState(1);
  const { stepOne, stepTwo, stepThree, open, onFinish } = props;

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
          display: 'flex',
          justifyContent: 'space-between',
          padding: '24px',
        }}
      >
        <SpotlightTarget name="1">{stepOne}</SpotlightTarget>
        <SpotlightTarget name="2">{stepTwo}</SpotlightTarget>
        <SpotlightTarget name="3">{stepThree}</SpotlightTarget>
      </div>
      <SpotlightTransition>
        {open && (
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

  const toggleOnboarding = (onboardingOpen: boolean) =>
    setOnboardingOpen(onboardingOpen);

  const toggleInline = (inlineOpen: boolean) => setInlineOpen(inlineOpen);

  const addFlag = () => setFlags([flags.length, ...flags]);

  const removeFlag = (id: number | string) =>
    setFlags(flags.filter((v) => v !== id));

  const { onClose, onOpen } = props;

  return (
    <React.Fragment>
      <ModalDialog onClose={onClose} testId="modal">
        <ModalHeader>
          <ModalTitle>Modal dialog</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>This dialog has three great features:</p>
          <ThreeStepSpotlight
            open={onboardingOpen}
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
          <Button appearance="subtle" onClick={onOpen}>
            Open another
          </Button>
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
    </React.Fragment>
  );
}

function App() {
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
        This example shows off all components that rely on portalling and
        layering to appear in the expected order.
      </p>
      <TooltipButton id={'openDialogBtn'} onClick={() => setModals([1])}>
        Open Dialog
      </TooltipButton>
    </React.Fragment>
  );
}

export default App;
