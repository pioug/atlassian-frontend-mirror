import React, { Component } from 'react';

import { ProfileCardTrigger } from '../../src';
import { ProfilecardTriggerPosition, ProfileClient } from '../../src/types';
import { analyticsHandler } from './util';

const positionsOrder: ProfilecardTriggerPosition[] = [
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'left-end',
  'top-end',
  'top',
  'top-start',
  'right-end',
  'right',
  'right-start',
];

const triggerStyles: React.CSSProperties = {
  display: 'flex',
  width: '48px',
  height: '48px',
  borderRadius: '48px',
  background: '#FF5630',
  color: '#fff',
  fontSize: '16px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
};

type Props = {
  resourceClient: ProfileClient;
};

type State = {
  positionIdx: number;
};

export default class InteractiveTrigger extends Component<Props, State> {
  state: State = {
    positionIdx: 0,
  };

  getPositionDisplayString() {
    return positionsOrder[this.state.positionIdx]
      .toUpperCase()
      .split('-')
      .reduce((prev, current) => `${prev}${current.charAt(0)}`, '');
  }

  changePosition = () => {
    this.setState({
      positionIdx:
        this.state.positionIdx === positionsOrder.length - 1
          ? 0
          : this.state.positionIdx + 1,
    });
  };

  renderTrigger(): React.ReactNode {
    return (
      <button style={triggerStyles} onClick={this.changePosition}>
        {this.getPositionDisplayString()}
      </button>
    );
  }

  render() {
    return (
      <div>
        <p>
          Hover over the circle to show the profilecard and click to change the
          cards position.
        </p>
        <ProfileCardTrigger
          cloudId="DUMMY-10ae0bf3-157e-43f7-be45-f1bb13b39048"
          userId="1"
          position={positionsOrder[this.state.positionIdx]}
          resourceClient={this.props.resourceClient}
          actions={[
            {
              label: 'View profile',
              id: 'view-profile',
              callback: () => {},
            },
          ]}
          analytics={analyticsHandler}
        >
          {this.renderTrigger()}
        </ProfileCardTrigger>
      </div>
    );
  }
}
