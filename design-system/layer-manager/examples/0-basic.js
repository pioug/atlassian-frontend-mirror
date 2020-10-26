import React, { Component } from 'react';
import Tooltip from '@atlaskit/tooltip';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/standard-button';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@atlaskit/onboarding';

// NOTE: @atlaskit/layer-manager is provided by the website

const Hr = () => (
  <div
    style={{
      backgroundColor: '#ddd',
      height: 1,
      margin: '8px 0',
    }}
  />
);

export default class Example extends Component {
  state = {
    modalIsVisible: false,
    modalTwoIsVisible: false,
    spotlightIsVisible: false,
  };

  toggleModal = () =>
    this.setState(state => ({
      modalIsVisible: !state.modalIsVisible,
    }));

  toggleModalTwo = () => {
    this.setState(state => ({
      modalTwoIsVisible: !state.modalTwoIsVisible,
    }));
  };

  toggleSpotlight = () => {
    this.setState(state => ({
      spotlightIsVisible: !state.spotlightIsVisible,
    }));
  };

  render() {
    const { modalIsVisible, spotlightIsVisible } = this.state;

    return (
      <SpotlightManager style={{ alignItems: 'center', display: 'flex' }}>
        <Tooltip content="Hello World">
          <Button>Tooltip</Button>
        </Tooltip>
        <Hr />
        <Button onClick={this.toggleModal}>Modal</Button>
        <Hr />
        <SpotlightTarget name="button">
          <Button onClick={this.toggleSpotlight}>Spotlight</Button>
        </SpotlightTarget>

        <ModalTransition>
          {modalIsVisible && (
            <Modal
              actions={[{ onClick: this.toggleModal, text: 'Close' }]}
              autoFocus
              heading="Hello World!"
              onClose={this.toggleModal}
            >
              <p>
                Cupcake ipsum dolor sit amet. Cheesecake fruitcake brownie donut
                dragée cotton candy. Sesame snaps gingerbread brownie caramels
                liquorice pie bonbon cake gummies.
              </p>
            </Modal>
          )}
        </ModalTransition>

        <SpotlightTransition>
          {spotlightIsVisible && (
            <Spotlight
              actions={[{ onClick: this.toggleSpotlight, text: 'Close' }]}
              dialogPlacement="bottom left"
              heading="Hello World!"
              key="button"
              target="button"
              targetBgColor="white"
              targetRadius={4}
            >
              Cupcake ipsum dolor sit amet. Cheesecake fruitcake brownie donut
              dragée cotton candy. Sesame snaps gingerbread brownie caramels
              liquorice pie bonbon cake gummies.
            </Spotlight>
          )}
        </SpotlightTransition>
      </SpotlightManager>
    );
  }
}
