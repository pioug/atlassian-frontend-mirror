import React from 'react';
import Button from '@atlaskit/button';
import Blanket from '../src';

type State = {
  canClickThrough: boolean;
  isBlanketVisible: boolean;
};

export default class BasicExample extends React.PureComponent<void, State> {
  state = {
    isBlanketVisible: false,
    canClickThrough: true,
  };

  showBlanketClick = () => {
    this.setState({
      isBlanketVisible: !this.state.isBlanketVisible,
    });
  };

  render() {
    return (
      <div>
        <Button appearance="default" onClick={this.showBlanketClick}>
          {!this.state.isBlanketVisible ? 'Show Blanket' : 'Hide Blanket'}
        </Button>
        <p>
          Open the blanket with canClickThrough enabled & click the blanket to
          dismiss it. With canClickThrough enabled onBlanketClicked is not
          called & elements underneath the blanket can be interacted with
          directly.
        </p>

        <Blanket isTinted={this.state.isBlanketVisible} canClickThrough />
      </div>
    );
  }
}
