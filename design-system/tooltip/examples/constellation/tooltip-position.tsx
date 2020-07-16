import React from 'react';

import Button from '@atlaskit/button';

import Tooltip from '../../src';
import { PositionType } from '../../src/types';

const VALID_POSITIONS: PositionType[] = [
  'mouse',
  'top',
  'right',
  'bottom',
  'left',
];

interface State {
  position: number;
}

export default class PositionExample extends React.Component<{}, State> {
  // store the direction as an index and pull it from the list above,
  // just to simplify the `changeDirection` logic
  state = { position: 0 };

  static defaultProps = {
    color: 'blue',
  };

  changeDirection = () => {
    this.setState({
      position: (this.state.position + 1) % VALID_POSITIONS.length,
    });
  };

  render() {
    const position = VALID_POSITIONS[this.state.position];

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions , jsx-a11y/click-events-have-key-events
      <div onClick={this.changeDirection}>
        <Tooltip content={position} position={position}>
          <Button appearance="primary">Target</Button>
        </Tooltip>
      </div>
    );
  }
}
