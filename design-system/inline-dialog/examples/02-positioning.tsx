import React, { Component } from 'react';

import Button from '@atlaskit/button/standard-button';

import InlineDialog from '../src';

import { Placements } from './utils';

interface State {
  placementIndex: number;
}

const styles: React.CSSProperties = {
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
};

export default class InlineDialogPositioningExample extends Component<
  {},
  State
> {
  state = {
    placementIndex: 0,
  };

  cyclePlacement = () => {
    const { placementIndex } = this.state;
    if (placementIndex < Placements.length - 1) {
      this.setState({ placementIndex: placementIndex + 1 });
    } else {
      this.setState({ placementIndex: 0 });
    }
  };

  render() {
    return (
      <div style={styles}>
        <div style={{ marginTop: 50 }}>
          <InlineDialog
            content={
              <div>
                <p>
                  Current placement:{' '}
                  <strong>{Placements[this.state.placementIndex]}</strong>.
                </p>
              </div>
            }
            isOpen
            placement={Placements[this.state.placementIndex]}
          >
            <Button appearance="primary" onClick={this.cyclePlacement}>
              Cycle the placement
            </Button>
          </InlineDialog>
        </div>
        <p>
          Note: &ldquo;auto&rdquo; placements put it on the side with the most
          available space
        </p>
      </div>
    );
  }
}
