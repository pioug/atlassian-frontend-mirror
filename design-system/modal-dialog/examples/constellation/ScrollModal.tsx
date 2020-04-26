import React from 'react';

import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button';
import FieldRadioGroup from '@atlaskit/field-radio-group';

import Modal, { ModalTransition } from '../../src';

const TallContainer = styled.div`
  height: 100%;
`;

const scrollBehaviors = [
  {
    name: 'scrollBehavior',
    value: 'inside',
    label: 'inside',
    defaultSelected: true,
  },
  { name: 'scrollBehavior', value: 'outside', label: 'outside' },
];

interface State {
  isOpen: boolean;
  scrollBehavior: 'inside' | 'outside';
}
export default class ScrollModal extends React.PureComponent<{}, State> {
  bottomRef: any;

  state: State = {
    isOpen: false,
    scrollBehavior: 'inside',
  };

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  scrollToBottom = () => this.bottomRef.scrollIntoView(true);

  onScrollBehaviorChange = (e: any) => {
    this.setState({
      scrollBehavior: e.target.value,
    });
  };

  render() {
    const { isOpen, scrollBehavior } = this.state;
    const actions = [
      { text: 'Close', onClick: this.close },
      { text: 'Scroll to bottom', onClick: this.scrollToBottom },
    ];

    return (
      <TallContainer>
        <FieldRadioGroup
          items={scrollBehaviors}
          label="Scroll behavior:"
          onRadioChange={this.onScrollBehaviorChange}
        />
        <Button onClick={this.open}>Open modal</Button>
        <ModalTransition>
          {isOpen && (
            <Modal
              actions={actions}
              onClose={this.close}
              heading="Modal Title"
              scrollBehavior={scrollBehavior}
            >
              <Lorem count={10} />
              <div
                ref={r => {
                  this.bottomRef = r;
                }}
              />
            </Modal>
          )}
        </ModalTransition>
      </TallContainer>
    );
  }
}
