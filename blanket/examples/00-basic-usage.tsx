import React from 'react';
import Button from '@atlaskit/button';
import Blanket from '../src';

type State = {
  onEventResult: string;
  canClickThrough: boolean;
  isBlanketVisible: boolean;
};

export default class BasicExample extends React.PureComponent<void, State> {
  state = {
    onEventResult: 'Blanket isTinted:false canClickThrough:true',
    canClickThrough: true,
    isBlanketVisible: false,
  };

  showBlanketClick = () => {
    this.setState({
      onEventResult: 'Blanket isTinted: true canClickThrough: false',
      isBlanketVisible: true,
      canClickThrough: false,
    });
  };

  onBlanketClicked = () => {
    this.setState({
      onEventResult: 'onBlanketClicked called with canClickThrough: true',
      isBlanketVisible: false,
      canClickThrough: true,
    });
  };

  render() {
    return (
      <div>
        <Button appearance="default" onClick={this.showBlanketClick}>
          Show blanket
        </Button>
        <p>Click to Open the blanket & click the blanket to dismiss it.</p>

        <Blanket
          onBlanketClicked={this.onBlanketClicked}
          isTinted={this.state.isBlanketVisible}
          canClickThrough={this.state.canClickThrough}
        />
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          {this.state.onEventResult}
        </div>
      </div>
    );
  }
}
