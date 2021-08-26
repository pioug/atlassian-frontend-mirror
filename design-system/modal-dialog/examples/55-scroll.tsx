/** @jsx jsx */
import { useCallback, useRef, useState } from 'react';

import { css, jsx } from '@emotion/core';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import Checkbox from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { gridSize } from '@atlaskit/theme/constants';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

const containerStyles = css({
  height: '200%',
  padding: `${gridSize() * 2}px`,
});

export default function ExampleScroll() {
  const [isOpen, setIsOpen] = useState(false);
  const [titleShown, setTitleShown] = useState(true);
  const [shouldScrollInViewport, setShouldScrollInViewPort] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(
    () => bottomRef.current?.scrollIntoView(true),
    [],
  );

  return (
    <div css={containerStyles}>
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

      <Field name="sb" label="Scrolling behavior">
        {() => (
          <Checkbox
            label="Should scroll within the viewport"
            name="scroll"
            testId="scroll"
            onChange={(e) => setShouldScrollInViewPort(e.target.checked)}
            isChecked={shouldScrollInViewport}
          />
        )}
      </Field>

      <Field name="hs" label="Visibility">
        {() => (
          <Checkbox
            label="Header/footer shown"
            name="visibility"
            testId="visibility"
            onChange={(e) => setTitleShown(e.target.checked)}
            isChecked={titleShown}
          />
        )}
      </Field>

      <br />
      <Button onClick={open} testId="modal-trigger">
        Open modal
      </Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            onClose={close}
            shouldScrollInViewport={shouldScrollInViewport}
            testId="modal"
          >
            {titleShown && (
              <ModalHeader>
                <ModalTitle>Modal Title</ModalTitle>
              </ModalHeader>
            )}
            <ModalBody>
              <Lorem count={10} />
              <div ref={bottomRef} />
            </ModalBody>
            {titleShown && (
              <ModalFooter>
                <Button
                  testId="scrollDown"
                  appearance="subtle"
                  onClick={scrollToBottom}
                >
                  Scroll to bottom
                </Button>
                <Button
                  autoFocus
                  testId="primary"
                  appearance="primary"
                  onClick={close}
                >
                  Close
                </Button>
              </ModalFooter>
            )}
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
