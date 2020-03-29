import React from 'react';
import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';
import Button from '@atlaskit/button';
import FieldRadioGroup from '@atlaskit/field-radio-group';
import Modal, { ModalTransition } from '../src';

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
export default class ExampleScroll extends React.PureComponent<{}, State> {
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
        <p>
          The scroll behavior of modals can be configured so that scrolling
          happens inside the modal body or outside the modal, within the
          viewport.
        </p>
        <p>
          In either case, modals prevent the window from being scrolled both
          natively and programatically. This means that certain browser issues
          such as <code>scrollIntoView</code> scrolling the window instead of
          only the closest scroll parent will be prevented.
        </p>
        <FieldRadioGroup
          items={scrollBehaviors}
          label="Scroll behavior:"
          onRadioChange={this.onScrollBehaviorChange}
        />
        <Button onClick={this.open}>Open Modal</Button>
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
