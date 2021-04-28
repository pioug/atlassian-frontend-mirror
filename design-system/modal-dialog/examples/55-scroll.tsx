import React from 'react';

import { css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import FieldRadioGroup from '@atlaskit/field-radio-group';

import Modal, { ModalTransition } from '../src';
import { ScrollBehavior } from '../src/internal/types';

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
  { name: 'scrollBehavior', value: 'inside-wide', label: 'inside-wide' },
];

interface State {
  isOpen: boolean;
  scrollBehavior: ScrollBehavior;
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
      { text: 'Close', onClick: this.close, testId: 'primary' },
      {
        text: 'Scroll to bottom',
        onClick: this.scrollToBottom,
        testId: 'scrollDown',
      },
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
        <p>
          <code>inside-wide</code> is used for cases where body width is wider
          than viewport width (horizontally scrollable).
        </p>
        {scrollBehavior === 'inside-wide' && (
          <React.Fragment>
            <Global
              styles={css`
                body {
                  width: 3000px !important;
                }
              `}
            />
            <p>
              The width of body is now greater than viewport width (horizontally
              scrollable).
            </p>
          </React.Fragment>
        )}
        <FieldRadioGroup
          items={scrollBehaviors}
          label="Scroll behavior:"
          onRadioChange={this.onScrollBehaviorChange}
        />
        <Button onClick={this.open} testId="modal-trigger">
          Open Modal
        </Button>
        <ModalTransition>
          {isOpen && (
            <Modal
              actions={actions}
              onClose={this.close}
              heading="Modal Title"
              scrollBehavior={scrollBehavior}
              testId="modal"
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
