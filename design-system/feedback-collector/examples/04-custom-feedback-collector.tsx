import React, { Component } from 'react';

import Button from '@atlaskit/button/standard-button';
import { FlagGroup } from '@atlaskit/flag';

import FeedbackCollector, { FeedbackFlag } from '../src';

interface State {
  isOpen: boolean;
  displayFlag: boolean;
}

const EMBEDDABLE_KEY = 'your_jsd_embeddable_key';
const REQUEST_TYPE_ID = 'your_jsd_request_type_id';
const name = 'Feedback Sender';
const email = 'fsender@atlassian.com';

const FeedbackPreamble = () => {
  const linkToSupport = 'https://support.atlassian.com/contact/#/';

  return (
    <>
      <p>Your thoughts are valuable in helping improve our products.</p>
      <p>
        If you're looking to get help or want to report a bug,{' '}
        <a href={linkToSupport} target="_blank" rel="noopener noreferrer">
          visit our support site.
        </a>
      </p>
    </>
  );
};

const CanContactLabel = () => {
  const linkToSupport = 'https://support.atlassian.com/contact/#/';

  return (
    <p>
      Atlassian can contact me about this feedback. See our{' '}
      <a href={linkToSupport} target="_blank" rel="noopener noreferrer">
        privacy policy
      </a>
    </p>
  );
};

const EnrolLabel = () => {
  const linkToSupport = 'https://support.atlassian.com/contact/#/';

  return (
    <p>
      I'd like to help improve Atlassian products by joining the{' '}
      <a href={linkToSupport} target="_blank" rel="noopener noreferrer">
        Atlassian Research Group
      </a>
    </p>
  );
};

class DisplayFeedback extends Component<{}, State> {
  state = { isOpen: false, displayFlag: false };

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  displayFlag = () => this.setState({ displayFlag: true });

  hideFlag = () => this.setState({ displayFlag: false });

  render() {
    const { isOpen, displayFlag } = this.state;
    return (
      <div>
        <Button appearance="primary" onClick={this.open}>
          Display Custom Feedback
        </Button>

        {isOpen && (
          <FeedbackCollector
            onClose={this.close}
            onSubmit={this.displayFlag}
            email={email}
            name={name}
            requestTypeId={REQUEST_TYPE_ID}
            embeddableKey={EMBEDDABLE_KEY}
            feedbackTitle="Give feedback"
            showTypeField={true}
            feedbackTitleDetails={<FeedbackPreamble />}
            canBeContactedLabel={<CanContactLabel />}
            enrolInResearchLabel={<EnrolLabel />}
            summaryPlaceholder="Let us know what's on your mind"
            cancelButtonLabel="Cancel Button Label"
            submitButtonLabel="Submit Button Label"
            feedbackGroupLabels={{
              bug: {
                fieldLabel: 'bug field label',
                selectOptionLabel: 'bug select option label',
              },
              comment: {
                fieldLabel: 'comment field label',
                selectOptionLabel: 'comment select option label',
              },
              suggestion: {
                fieldLabel: 'suggestion field label',
                selectOptionLabel: 'suggestion select option label',
              },
              question: {
                fieldLabel: 'question field label',
                selectOptionLabel: 'question select option label',
              },
              empty: {
                fieldLabel: 'empty field label',
                selectOptionLabel: 'empty select option label',
              },
            }}
          />
        )}

        {displayFlag && (
          <FlagGroup onDismissed={this.hideFlag}>
            <FeedbackFlag description="Flag Description" title="Flag Title" />
          </FlagGroup>
        )}
      </div>
    );
  }
}

export default () => <DisplayFeedback />;
