import React from 'react';
import { Target } from './styled';
import Tooltip from '../src';
import { PositionType } from '../src/types';

const colors = ['teal', 'blue', 'purple'];

interface State {
  position: PositionType;
}

export default class HoverIntent extends React.Component<{}, State> {
  state: State = {
    position: 'bottom',
  };

  handleClick = () => {
    this.setState({
      position: this.state.position === 'bottom' ? 'mouse' : 'bottom',
    });
  };

  render() {
    const { position } = this.state;
    return (
      <React.Fragment>
        <p>
          Click a target to toggle the position of the tooltips between{' '}
          {`'bottom'`} and {`'mouse'`}.
        </p>
        <div style={{ display: 'flex', marginTop: 10 }}>
          {colors.map((c, i) => (
            <Tooltip key={c} content={`Content ${i + 1}`} position={position}>
              <Target
                onClick={this.handleClick}
                color={c}
                style={{ marginRight: 8 }}
                tabIndex={0}
              >
                Target {i + 1}
              </Target>
            </Tooltip>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
