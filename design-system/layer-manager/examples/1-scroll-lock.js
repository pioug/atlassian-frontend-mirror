import React, { Component } from 'react';
import { ScrollLock } from '../src';

export default class ScrollLockExample extends Component {
  state = { isActive: false };

  toggleLock = () => this.setState(state => ({ isActive: !state.isActive }));

  render() {
    const { isActive } = this.state;
    const id = 'scroll-lock-example-checkbox';

    return (
      <div>
        Disable scroll on the body:{' '}
        <label htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            onChange={this.toggleLock}
            checked={isActive}
          />
          {isActive ? 'Locked' : 'Unlocked'}
        </label>
        {isActive ? <ScrollLock /> : null}
      </div>
    );
  }
}
