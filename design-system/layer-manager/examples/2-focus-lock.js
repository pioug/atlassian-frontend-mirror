import React, { Component } from 'react';
import UnlockIcon from '@atlaskit/icon/glyph/unlock';
import LockIcon from '@atlaskit/icon/glyph/lock';
import { FocusLock } from '../src';

export default class FocusLockExample extends Component {
  target;

  state = { isActive: false };

  toggleLock = () => {
    this.setState(state => ({ isActive: !state.isActive }));
  };

  render() {
    const { isActive } = this.state;
    const boxStyle = {
      backgroundColor: isActive ? '#f6f6f6' : '#fafafa',
      borderRadius: 4,
      display: 'flex',
      marginTop: 8,
      padding: 8,
    };

    return (
      <div>
        <p>
          Lock focus to the div below:{' '}
          <button onClick={this.toggleLock}>
            {isActive ? 'Unlock' : 'Lock'}
          </button>
        </p>
        <FocusLock enabled={isActive} autoFocus>
          <div style={boxStyle}>
            <div style={{ flexShrink: 0, opacity: isActive ? 1 : 0.5 }}>
              {isActive ? (
                <LockIcon label="Focus locked icon" />
              ) : (
                <UnlockIcon label="Focus unlocked icon" />
              )}
            </div>
            <div style={{ paddingLeft: 8, paddingRight: 16 }}>
              <p>
                Once a user moves focus to this element or one of its tabbable
                descendents they will not be able to tab outside of it.
              </p>
              <p>
                <button>Button 1</button>
                <button>Button 2</button>
                <button>Button 3</button>
              </p>
            </div>
          </div>
        </FocusLock>
      </div>
    );
  }
}
