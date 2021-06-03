import React, { Component } from 'react';

import Button from '@atlaskit/button/custom-theme-button';

import { Modal } from '../src';

import welcomeImage from './assets/this-is-new-jira.png';

interface State {
  active: boolean;
  primaryButtonOnRight: boolean;
}

export default class ModalBasicExample extends Component<{}, State> {
  state: State = { active: false, primaryButtonOnRight: false };

  start = () => this.setState({ active: true });

  finish = () => this.setState({ active: false });

  togglePrimaryButtonPosition = () =>
    this.setState((state) => ({
      primaryButtonOnRight: !state.primaryButtonOnRight,
    }));

  render() {
    const { active } = this.state;

    return (
      <div>
        <Button onClick={this.start}>Launch benefits modal</Button>
        <label htmlFor="togglePrimaryButtonPosition">
          <input
            id="togglePrimaryButtonPosition"
            type="checkbox"
            value={String(this.state.primaryButtonOnRight)}
            onChange={this.togglePrimaryButtonPosition}
          />{' '}
          Toggle primary button position in dialog
        </label>
        {active && (
          <Modal
            actions={[
              { onClick: this.finish, text: 'Switch to the new Jira' },
              { onClick: this.finish, text: 'Remind me later' },
            ]}
            heading="Experience your new Jira"
            experimental_shouldShowPrimaryButtonOnRight={
              this.state.primaryButtonOnRight
            }
            image={welcomeImage}
            key="welcome"
          >
            <p>
              Switch context, jump between project, and get back to work quickly
              with our new look and feel.
            </p>
            <p>Take it for a spin and let us know what you think.</p>
          </Modal>
        )}
      </div>
    );
  }
}
