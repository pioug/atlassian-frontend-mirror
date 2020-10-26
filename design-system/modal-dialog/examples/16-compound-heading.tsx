import React, { FC, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { R400 } from '@atlaskit/theme/colors';

import Modal, { HeaderComponentProps, ModalTransition } from '../src';

const headerStyles: React.CSSProperties = {
  background:
    'url(https://atlassian.design/react_assets/images/cards/personality.png) center top no-repeat',
  backgroundSize: 'cover',
  borderRadius: '4px 4px 0 0',
  paddingTop: 170,
  position: 'relative',
};

const headingStyles: React.CSSProperties = {
  top: 100,
  position: 'absolute',
  padding: '2px 24px',
  textTransform: 'uppercase',
};

const Header: FC<HeaderComponentProps> = ({ id, onClose }) => (
  <div style={headerStyles}>
    <h3 id={id} style={headingStyles}>
      A customised header
    </h3>
    <span style={{ position: 'absolute', right: 0, top: 4 }}>
      <Button onClick={onClose} appearance="link">
        <CrossIcon label="Close Modal" primaryColor={R400} size="small" />
      </Button>
    </span>
  </div>
);

const CompoundHeadingModal = () => {
  const [isOpen, setOpen] = useState(false);

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  const secondaryAction = ({ target }: any) => console.log(target.innerText);

  const actions = [
    { text: 'Close', onClick: close },
    { text: 'Secondary Action', onClick: secondaryAction },
  ];

  return (
    <div>
      <Button onClick={open}>Open Modal</Button>

      <ModalTransition>
        {isOpen && (
          <Modal
            actions={actions}
            onClose={close}
            components={{
              Header: Header,
            }}
          >
            <Lorem count={2} />
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
};

export default CompoundHeadingModal;
