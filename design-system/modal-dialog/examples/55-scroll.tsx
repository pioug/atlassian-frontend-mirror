import React, { useRef, useState } from 'react';

import { css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import Checkbox from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';

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

export default function ExampleScroll() {
  const [isOpen, setIsOpen] = useState(false);
  const [headingShown, setHeadingShown] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [scrollBehavior, setScrollBehavior] = useState<ScrollBehavior>(
    'inside',
  );

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  const actions = headingShown
    ? [
        { text: 'Close', onClick: close, testId: 'primary' },
        {
          text: 'Scroll to bottom',
          onClick: () => bottomRef.current?.scrollIntoView(true),
          testId: 'scrollDown',
        },
      ]
    : undefined;

  return (
    <TallContainer>
      <p>
        The scroll behavior of modals can be configured so that scrolling
        happens inside the modal body or outside the modal, within the viewport.
      </p>
      <p>
        In either case, modals prevent the window from being scrolled both
        natively and programatically. This means that certain browser issues
        such as <code>scrollIntoView</code> scrolling the window instead of only
        the closest scroll parent will be prevented.
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

      <Field name="sb" label="Scrolling behavior">
        {() => (
          <RadioGroup
            options={scrollBehaviors}
            value={scrollBehavior}
            onChange={e => setScrollBehavior(e.target.value as ScrollBehavior)}
          />
        )}
      </Field>

      <Field name="hs" label="Visibility">
        {() => (
          <Checkbox
            label="Heading/footer shown"
            name="visibility"
            testId="visibility"
            onChange={e => setHeadingShown(e.target.checked)}
            isChecked={headingShown}
          />
        )}
      </Field>

      <Button onClick={open} testId="modal-trigger">
        Open Modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            actions={actions}
            onClose={close}
            heading={headingShown ? 'Modal Title' : ''}
            scrollBehavior={scrollBehavior}
            testId="modal"
          >
            <Lorem count={10} />
            <div ref={bottomRef} />
          </Modal>
        )}
      </ModalTransition>
    </TallContainer>
  );
}
