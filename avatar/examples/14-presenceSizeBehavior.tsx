import React, { Component } from 'react';
import { Presence } from '../src';
import { Note } from '../examples-util/helpers';

type State = {
  width: number;
};

export default class PresenceWidthExample extends Component<any, State> {
  state: State = {
    width: 60,
  };

  render() {
    const { width } = this.state;

    return (
      <div>
        <Note>
          <p>
            By default presences will <strong>stretch</strong> to fill their
            parents. Try resizing the wrapping div below to see this in action.
          </p>
          <p>
            Therefore it is <strong>recommended to always</strong> have a
            wrapping div around presences when consuming them separately to
            Avatars.
          </p>
        </Note>
        <input
          min="10"
          max="130"
          onChange={e => this.setState({ width: parseInt(e.target.value, 10) })}
          step="10"
          title="Width"
          type="range"
          value={width}
        />
        <div style={{ maxWidth: width, border: '1px dotted blue' }}>
          <Presence presence="busy" />
        </div>
      </div>
    );
  }
}
