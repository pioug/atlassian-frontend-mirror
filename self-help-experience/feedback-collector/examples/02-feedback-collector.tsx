import React, { Component } from 'react';

import Button from '@atlaskit/button/standard-button';
import { FlagGroup } from '@atlaskit/flag';

import FeedbackCollector, { FeedbackFlag } from '../src';

interface State {
  isOpen: boolean;
  displayFlag: boolean;
}

const EMBEDDABLE_KEY = '9c8cb902-5bb0-41a4-84a5-3337ba10d6af';
const REQUEST_TYPE_ID = '475';
const name = 'Feedback Sender';
const email = 'fsender@atlassian.com';

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
          Display Feedback
        </Button>

        {isOpen && (
          <FeedbackCollector
            url={'https://api-private.atlassian.com'}
            onClose={this.close}
            onSubmit={this.displayFlag}
            email={email}
            name={name}
            requestTypeId={REQUEST_TYPE_ID}
            embeddableKey={EMBEDDABLE_KEY}
          />
        )}

        <FlagGroup onDismissed={this.hideFlag}>
          {displayFlag && <FeedbackFlag />}
        </FlagGroup>
      </div>
    );
  }
}

export default () => <DisplayFeedback />;
