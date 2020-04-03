import React from 'react';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Drawer from '@atlaskit/drawer';
import Button, { ButtonGroup } from '@atlaskit/button';
import { PopupSelect } from '../src';

const options = [
  { label: 'Adelaide', value: 'adelaide' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

export default () => {
  const [isOpen, setIsOpen] = React.useState();
  const [type, setType] = React.useState('modal');

  const select = (
    <PopupSelect
      searchThreshold={99}
      options={options}
      menuPlacement="bottom"
      target={({ ref }) => <Button ref={ref}>Choose</Button>}
    />
  );

  return (
    <>
      <ButtonGroup>
        <Button isSelected={type === 'modal'} onClick={() => setType('modal')}>
          Modal
        </Button>
        <Button
          isSelected={type === 'drawer'}
          onClick={() => setType('drawer')}
        >
          Drawer
        </Button>
        <Button appearance="primary" onClick={() => setIsOpen(true)}>
          Open
        </Button>
      </ButtonGroup>

      {select}

      {type === 'drawer' && (
        <Drawer onClose={() => setIsOpen(false)} isOpen={isOpen}>
          {select}
        </Drawer>
      )}

      <ModalTransition>
        {type === 'modal' && isOpen && (
          <ModalDialog onClose={() => setIsOpen(false)}>{select}</ModalDialog>
        )}
      </ModalTransition>
    </>
  );
};
