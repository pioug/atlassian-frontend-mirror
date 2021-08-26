import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { R400 } from '@atlaskit/theme/colors';

import ModalDialog, {
  ModalBody,
  ModalFooter,
  ModalTransition,
  useModal,
} from '../src';

const headerStyles: React.CSSProperties = {
  background:
    'url(https://atlassian.design/react_assets/images/cards/personality.png) center top no-repeat',
  backgroundSize: 'cover',
  borderRadius: '4px 4px 0 0',
  paddingTop: 170,
  position: 'relative',
};

const titleStyles: React.CSSProperties = {
  top: 100,
  position: 'absolute',
  padding: '2px 24px',
  textTransform: 'uppercase',
};

const CustomHeader = () => {
  const { titleId, onClose } = useModal();

  return (
    <div style={headerStyles}>
      <h3 id={titleId} style={titleStyles}>
        A customised header
      </h3>
      <span style={{ position: 'absolute', right: 0, top: 4 }}>
        <Button onClick={onClose} appearance="link">
          <CrossIcon label="Close Modal" primaryColor={R400} size="small" />
        </Button>
      </span>
    </div>
  );
};

export default function CompoundTitleModal() {
  const [isOpen, setOpen] = useState(false);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const secondaryAction = useCallback(
    ({ target }: any) => console.log(target.innerText),
    [],
  );

  return (
    <div>
      <Button onClick={open}>Open Modal</Button>

      <ModalTransition>
        {isOpen && (
          <ModalDialog onClose={close}>
            <CustomHeader />
            <ModalBody>
              <Lorem count={2} />
            </ModalBody>
            <ModalFooter>
              <Button onClick={secondaryAction} appearance="subtle">
                Secondary Action
              </Button>
              <Button autoFocus onClick={close} appearance="primary">
                Close
              </Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
}
