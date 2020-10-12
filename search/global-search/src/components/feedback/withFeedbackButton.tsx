import React from 'react';
import { ComponentType } from 'react';
import FeedbackButton from './FeedbackButton';
import FeedbackCollector, { FeedbackFlag } from '@atlaskit/feedback-collector';
import { FlagGroup } from '@atlaskit/flag';
import { FeaturesProviderProps, injectFeatures } from '../FeaturesProvider';

const EMBEDDABLE_KEY = '85dc6027-c074-4800-ba54-4ecb844b29f8';
const REQUEST_TYPE_ID = '182';
const FEEDBACK_CONTEXT_CF = 'customfield_10047';

export interface FeedbackCollectorProps {
  name?: string;
  email?: string;
}

export interface InjectedInputControlProps {
  inputControls: JSX.Element | undefined;
}

interface State {
  isOpen: boolean;
  displayFlag: boolean;
}

export function withFeedbackButton<P extends InjectedInputControlProps>(
  WrappedComponent: ComponentType<P>,
) {
  class WithFeedbackButton extends React.Component<
    Pick<P, Exclude<keyof P, keyof InjectedInputControlProps>> &
      FeedbackCollectorProps &
      FeaturesProviderProps,
    State
  > {
    static displayName = `WithFeedbackButton(${
      WrappedComponent.displayName || WrappedComponent.name
    })`;

    state = {
      isOpen: false,
      displayFlag: false,
    };

    open = () => this.setState({ isOpen: true });

    close = () => {
      this.setState({ isOpen: false });
    };

    displayFlag = () => this.setState({ displayFlag: true });

    hideFlag = () => this.setState({ displayFlag: false });

    renderFeedbackButton() {
      return <FeedbackButton onClick={this.open} />;
    }

    render() {
      const { isOpen, displayFlag } = this.state;

      const {
        name,
        email,
        features: {
          abTest: { experimentId, abTestId },
        },
      } = this.props;
      const feedbackContext = `experimentId: ${experimentId}, abTestId: ${abTestId}`;

      return (
        <>
          <WrappedComponent
            {...(this.props as any)}
            inputControls={this.renderFeedbackButton()}
          />
          {isOpen && (
            <FeedbackCollector
              onClose={this.close}
              onSubmit={this.displayFlag}
              email={email}
              name={name}
              requestTypeId={REQUEST_TYPE_ID}
              embeddableKey={EMBEDDABLE_KEY}
              additionalFields={[
                {
                  id: FEEDBACK_CONTEXT_CF,
                  value: feedbackContext,
                },
              ]}
            />
          )}

          {displayFlag && (
            <FlagGroup onDismissed={this.hideFlag}>
              <FeedbackFlag />
            </FlagGroup>
          )}
        </>
      );
    }
  }

  return injectFeatures(WithFeedbackButton);
}
