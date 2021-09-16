import React, { Component } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';

import InlineDialog from '../src';

interface State {
  dialogOpen: boolean;
}

const content = (
  <div>
    <p>Some content within the inline-dialog so that it gets a little wider</p>
  </div>
);

export default class InlineDialogParentClippingExample extends Component<
  {},
  State
> {
  state = {
    dialogOpen: false,
  };

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen });

  render() {
    return (
      <div>
        <p>
          The inline-dialog should break out of the overflow: hidden; parent and
          also react to window bounds when you resize the viewport.
        </p>
        <div
          style={{
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            border: '2px dashed grey',
            boxSizing: 'border-box',
            height: '100px',
            margin: '10px auto',
            overflow: 'hidden',
            position: 'relative',
            width: '95%',
          }}
        >
          <Lorem count={1} />
          <p>
            Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
            ullamco deserunt aute id consequat veniam incididunt duis in sint
            irure nisi. Mollit officia cillum Lorem ullamco minim nostrud elit
            officia tempor esse quis.
            <InlineDialog content={content} isOpen={this.state.dialogOpen}>
              <Button
                isSelected={this.state.dialogOpen}
                onClick={this.toggleDialog}
                appearance="primary"
              >
                Click to open
              </Button>
            </InlineDialog>
          </p>
          <Lorem count={6} />
        </div>
      </div>
    );
  }
}
