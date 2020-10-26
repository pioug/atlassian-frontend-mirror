import React, { Component } from 'react';

import Button from '@atlaskit/button/standard-button';

import { FeedbackForm } from '../src';

interface State {
  isOpen: boolean;
  displayFlag: boolean;
}

class DisplayFeedback extends Component<{}, State> {
  state = { isOpen: false, displayFlag: false };

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  submitForm = (data: Object) => {
    // submit your form manually here
    console.log('Submitting feedback form', data);

    // on success:
    // this.close();
  };

  render() {
    const { isOpen } = this.state;
    return (
      <div>
        <Button appearance="primary" onClick={this.open}>
          Display Feedback Form
        </Button>

        {isOpen && (
          <FeedbackForm onClose={this.close} onSubmit={this.submitForm} />
        )}
      </div>
    );
  }
}

export default () => <DisplayFeedback />;
