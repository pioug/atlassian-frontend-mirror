import React, { Component } from 'react';
import { AnalyticsListener, AnalyticsContext } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import LayerManager from '../src';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component {
  state = {
    isModalOpen: false,
  };

  openModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  onEvent = event => {
    console.log('Event payload', event.payload);
    console.log('Event context', event.context);
  };

  render() {
    return (
      <LayerManager>
        <AnalyticsListener channel="atlaskit" onEvent={this.onEvent}>
          <div style={{ height: '100vh' }}>
            <p>
              Since the Analytics-next package relies on the context to fire
              events correctly, we&apos;re passing the analytics context down
              through the portal so that it continues to work.
            </p>
            <AnalyticsContext data={{ isDecorated: true }}>
              <p>
                <button onClick={this.openModal}>Open modal</button>
                <ModalTransition>
                  {this.state.isModalOpen && (
                    <Modal
                      actions={[{ text: 'OK', onClick: this.closeModal }]}
                      onClose={this.closeModal}
                      heading="Modal"
                    >
                      <Button analyticsContext={{ name: 'buttonInsidePortal' }}>
                        Click me to fire an event
                      </Button>
                    </Modal>
                  )}
                </ModalTransition>
              </p>
            </AnalyticsContext>
          </div>
        </AnalyticsListener>
      </LayerManager>
    );
  }
}
