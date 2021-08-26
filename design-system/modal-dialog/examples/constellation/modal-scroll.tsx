import React, { useCallback, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../../src';

export default function Example() {
  const [shouldScrollInViewport, setShouldScrollInViewport] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = useCallback(() => setIsOpen(false), [setIsOpen]);
  const setShouldScrollInViewportAndOpen = useCallback(
    (shouldScrollInViewport: boolean) => {
      setShouldScrollInViewport(shouldScrollInViewport);
      requestAnimationFrame(() => setIsOpen(true));
    },
    [setShouldScrollInViewport],
  );

  return (
    <>
      <ButtonGroup appearance="primary">
        <Button onClick={() => setShouldScrollInViewportAndOpen(false)}>
          Scroll inside body
        </Button>
        <Button onClick={() => setShouldScrollInViewportAndOpen(true)}>
          Scroll inside viewport
        </Button>
      </ButtonGroup>

      <ModalTransition>
        {isOpen && (
          <Modal
            onClose={closeModal}
            shouldScrollInViewport={shouldScrollInViewport}
            height={600}
          >
            <ModalHeader>
              <ModalTitle>Our voice and tone</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <h5>Be bold</h5>
              <p>
                Motivate teams to do their best work. Offer best practices to
                get users going in the right direction. Be bold and offer just
                enough help to get the work started, and then get out of the
                way. Give accurate information so users can make educated
                decisions. Know your user's struggles and desired outcomes and
                give just enough information to let them get where they need to
                go.
              </p>

              <h5>Be optimistic</h5>

              <p>
                Focusing on the details gives people confidence in our products.
                Weave a consistent story across our fabric and be diligent about
                vocabulary across all messaging by being brand conscious across
                products to create a seamless flow across all the things. Let
                people know that they can jump in and start working expecting to
                find a dependable experience across all the things. Keep teams
                in the loop about what is happening by informing them of
                relevant features, products and opportunities for success. Be on
                the journey with them and highlight the key points that will
                help them the most - right now. Be in the moment by focusing
                attention on the important bits first.
              </p>

              <h5>Be practical, with a wink</h5>

              <p>
                Keep our own story short and give teams just enough to get
                moving. Get to the point and be direct. Be concise - we tell the
                story of how we can help, but we do it directly and with
                purpose. Be on the lookout for opportunities and be quick to
                offer a helping hand. At the same time realize that nobody likes
                a nosy neighbor. Give the user just enough to know that
                something awesome is around the corner and then get out of the
                way. Write clear, accurate, and concise text that makes
                interfaces more usable and consistent - and builds trust. We
                strive to write text that is understandable by anyone, anywhere,
                regardless of their culture or language so that everyone feels
                they are part of the team.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button appearance="primary" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
