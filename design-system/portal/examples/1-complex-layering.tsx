/* eslint-disable react/no-multi-comp */
import React, { ReactNode } from 'react';
import Button from '@atlaskit/button';
import EmojiIcon from '@atlaskit/icon/glyph/emoji';
import Flag, { FlagGroup } from '@atlaskit/flag';
import InlineDialog from '@atlaskit/inline-dialog';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
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
}: {
  children: ReactNode;
  onClick: () => void;
}) => (
  <div style={{ backgroundColor: 'white' }}>
    <Tooltip content="Click me">
      <Button onClick={onClick}>{children}</Button>
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

class ThreeStepSpotlight extends React.Component<
  SpotlightProps,
  { step: number }
> {
  state = {
    step: 1,
  };

  next = () => {
    const nextStep = this.state.step + 1;
    if (nextStep > 3) {
      this.setState({ step: 1 });
      this.props.onFinish();
    } else {
      this.setState({ step: nextStep });
    }
  };

  render() {
    const { stepOne, stepTwo, stepThree, open } = this.props;
    const { step } = this.state;
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
              actions={[
                { onClick: this.next, text: step === 3 ? 'Close' : 'Next' },
              ]}
              heading={`Here is step ${step} of 3`}
              key={`${step}`}
              target={`${step}`}
            />
          )}
        </SpotlightTransition>
      </SpotlightManager>
    );
  }
}

type ModalState = {
  onboardingOpen: boolean;
  inlineOpen: boolean;
  flags: number[];
};

type ModalProps = {
  onOpen: () => void;
  onClose: () => void;
};

class Modal extends React.Component<ModalProps, ModalState> {
  state = {
    onboardingOpen: false,
    inlineOpen: false,
    flags: [],
  };

  toggleOnboarding = (onboardingOpen: boolean) =>
    this.setState({ onboardingOpen });

  toggleInline = (inlineOpen: boolean) => this.setState({ inlineOpen });

  addFlag = () =>
    this.setState({ flags: [this.state.flags.length, ...this.state.flags] });

  removeFlag = (id: number) =>
    this.setState({ flags: this.state.flags.filter(v => v !== id) });

  render() {
    const { onboardingOpen, inlineOpen, flags } = this.state;
    return (
      <React.Fragment>
        <ModalDialog
          heading="Modal dialog 🔥"
          onClose={this.props.onClose}
          actions={[
            { text: 'Open another', onClick: this.props.onOpen },
            { text: 'Close', onClick: this.props.onClose },
          ]}
        >
          <p>This dialog has three great features:</p>
          <ThreeStepSpotlight
            open={onboardingOpen}
            onFinish={() => this.toggleOnboarding(false)}
            stepOne={
              <TooltipButton onClick={() => this.toggleOnboarding(true)}>
                Show onboarding
              </TooltipButton>
            }
            stepTwo={
              <InlineDialog
                content="This button is very nice"
                isOpen={inlineOpen}
              >
                <TooltipButton onClick={() => this.toggleInline(!inlineOpen)}>
                  Show an inline dialog
                </TooltipButton>
              </InlineDialog>
            }
            stepThree={
              <TooltipButton onClick={() => this.addFlag()}>
                Show an flag
              </TooltipButton>
            }
          />
        </ModalDialog>
        <FlagGroup onDismissed={(id: number) => this.removeFlag(id)}>
          {flags.map(id => (
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
}

type State = {
  modals: number[];
};

class App extends React.Component<{}, State> {
  state = {
    modals: [],
  };

  render() {
    const { modals } = this.state;
    const nextId = modals.length + 1;
    return (
      <React.Fragment>
        <ModalTransition>
          {modals.map(id => (
            <Modal
              key={id}
              onOpen={() => this.setState({ modals: [...modals, nextId] })}
              onClose={() =>
                this.setState({ modals: modals.filter(i => i !== id) })
              }
            />
          ))}
        </ModalTransition>
        <p>
          This example shows off all components that rely on portalling and
          layering to appear in the expected order.
        </p>
        <TooltipButton
          onClick={() =>
            this.setState({
              modals: [1],
            })
          }
        >
          Open Dialog
        </TooltipButton>
      </React.Fragment>
    );
  }
}

export default App;
