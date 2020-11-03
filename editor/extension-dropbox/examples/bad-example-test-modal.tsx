import React, { useState } from 'react';
import Button from '@atlaskit/button/standard-button';
import SectionMessage from '@atlaskit/section-message';
import Modal from '../src/modal';

export default () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <SectionMessage appearance="warning">
        Internal component only - not consumable outside this package
      </SectionMessage>
      <Button onClick={() => setIsOpen(true)}>Show Modal</Button>
      <Modal
        showModal={isOpen}
        onClose={() => setIsOpen(false)}
        TEST_ONLY_src="http://localhost:9000/examples.html?groupId=editor&packageId=extension-dropbox&exampleId=bad-example-modal-content"
      />
    </>
  );
};
