import React from 'react';

import Button from '@atlaskit/button';
import Spinner from '../src';

type State = {
  isLoading: boolean;
  showSpinner: boolean;
};

class SpinnerButton extends React.PureComponent<{}, State> {
  state = {
    isLoading: false,
    showSpinner: false,
  };

  fetchStuff = () => {
    this.setState({ isLoading: true, showSpinner: true });
    window.setTimeout(() => this.setState({ showSpinner: false }), 2000);
  };

  completeLoad = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { isLoading, showSpinner } = this.state;
    return (
      <Button
        appearance="primary"
        iconAfter={
          <Spinner
            invertColor
            isCompleting={!showSpinner}
            onComplete={this.completeLoad}
          />
        }
        onClick={!isLoading ? this.fetchStuff : undefined}
      >
        Load something
      </Button>
    );
  }
}

export default () => (
  <div style={{ padding: '10px' }}>
    <SpinnerButton />
  </div>
);
