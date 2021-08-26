/** @jsx jsx */
import { useCallback, useRef, useState } from 'react';

import { css, jsx } from '@emotion/core';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import Checkbox from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { gridSize } from '@atlaskit/theme/constants';

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

const containerStyles = css({
  display: 'grid',
  width: '250%',
  padding: `${gridSize() * 2}px`,
  gridTemplateColumns: 'repeat(2, 1fr)',
});

export default function ExampleScroll() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldScrollInViewport, setShouldScrollInViewPort] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerIntoView = useCallback(
    () => triggerRef.current && triggerRef.current.scrollIntoView(true),
    [],
  );

  return (
    <div css={containerStyles}>
      <div>
        <p>
          The width of body is greater than viewport width (horizontally
          scrollable).
        </p>

        <br />
        <Button onClick={scrollTriggerIntoView} testId="scroll-into-view">
          Scroll trigger into view
        </Button>
      </div>

      <div ref={triggerRef}>
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

        <br />
        <Button onClick={open} testId="modal-trigger">
          Open modal
        </Button>
      </div>

      <ModalTransition>
        {isOpen && (
          <ModalDialog
            onClose={close}
            shouldScrollInViewport={shouldScrollInViewport}
            testId="modal"
          >
            <ModalHeader>
              <ModalTitle>Modal Title</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Lorem count={10} />
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" testId="scrollDown">
                Scroll to bottom
              </Button>
              <Button
                autoFocus
                appearance="primary"
                onClick={close}
                testId="primary"
              >
                Close
              </Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
