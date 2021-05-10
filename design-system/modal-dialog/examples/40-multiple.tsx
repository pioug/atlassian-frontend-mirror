import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import Modal, { ModalTransition } from '../src';

const sizes = ['large', 'medium', 'small'];

export default function NestedDemo() {
  const [openModals, setOpenModals] = useState<{ [key: string]: boolean }>({});
  const open = (name: string) =>
    setOpenModals(prev => ({ ...prev, [name]: true }));
  const close = (name: string) =>
    setOpenModals(prev => ({ ...prev, [name]: false }));

  const handleStackChange = (idx: number, name: string) => {
    console.info(`"${name}" stack change`, idx);
    console.log(`"${name}" stack change ${idx}`);
  };

  const handleOpenComplete = (name: string) => {
    console.info(`The enter animation of modal #${name} has completed.`);
  };

  const handleCloseComplete = (name: string) => {
    console.info(`The exit animation of the "${name}" modal has completed.`);
  };

  return (
    <div style={{ maxWidth: 400, padding: 16 }}>
      <ButtonGroup>
        {sizes.map(name => (
          <Button key={name} testId={name} onClick={() => open(name)}>
            Open: {name}
          </Button>
        ))}
      </ButtonGroup>
      <p>
        For illustrative purposes three {'"stacked"'} modals can be opened in
        this demo, though ADG3 recommends only two at any time.
      </p>
      <p>
        Check the storybook{"'"}s {'"action logger"'} (or your console) to see
        how you can make use of the <code>onStackChange</code> property.
      </p>

      {sizes.map((name, index) => {
        const nextModal = sizes[index + 1];
        const actions = [{ text: 'Close', onClick: () => close(name) }];

        if (nextModal) {
          actions.push({
            text: `Open: ${nextModal}`,
            onClick: () => open(nextModal),
          });
        }

        return (
          <ModalTransition key={name}>
            {openModals[name] && (
              <Modal
                actions={actions}
                onClose={() => close(name)}
                onCloseComplete={() => handleCloseComplete(name)}
                onOpenComplete={() => handleOpenComplete(name)}
                onStackChange={id => handleStackChange(id, name)}
                heading={`Modal: ${name}`}
                width={name}
                testId="modal"
              >
                <Lorem count={2} />
              </Modal>
            )}
          </ModalTransition>
        );
      })}
    </div>
  );
}
