import React from 'react';
import { Target } from './styled';
import { Color } from './styled';
import Tooltip from '../src';
import { PositionType } from '../src/types';

const VALID_POSITIONS: PositionType[] = [
  'mouse',
  'top',
  'right',
  'bottom',
  'left',
];

interface Props {
  color: Color;
}
interface State {
  position: number;
}

export default class PositionExample extends React.Component<Props, State> {
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
      <div style={{ padding: '40px 40px' }} onClick={this.changeDirection}>
        <Tooltip content={position} position={position}>
          <Target color={this.props.color}>Target</Target>
        </Tooltip>
      </div>
    );
  }
}
