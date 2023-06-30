import React, { useState } from 'react';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ModalDialog, {
  ModalTransition,
  ModalBody,
} from '@atlaskit/modal-dialog';
import Drawer from '@atlaskit/drawer';
import Button, { ButtonGroup } from '@atlaskit/button';

import { PopupSelect } from '../../src';

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

const SelectPopupModalExample = () => {
  const [type, setType] = useState<'modal' | 'drawer'>();

  const popupSelectElement = (
    <PopupSelect
      isSearchable={false}
      options={options}
      menuPlacement="bottom"
      popperProps={{
        modifiers: [
          { name: 'offset', options: { offset: [0, 8] } },
          {
            name: 'preventOverflow',
            enabled: false,
          },
        ],
      }}
      target={({ isOpen, ...triggerProps }) => (
        <Button
          {...triggerProps}
          isSelected={isOpen}
          iconAfter={<ChevronDownIcon label="" />}
        >
          Open
        </Button>
      )}
    />
  );

  return (
    <>
      <ButtonGroup>
        <Button onClick={() => setType('modal')}>Open modal</Button>
        <Button onClick={() => setType('drawer')}>Open drawer</Button>
      </ButtonGroup>

      <Drawer onClose={() => setType(undefined)} isOpen={type === 'drawer'}>
        {popupSelectElement}
      </Drawer>

      <ModalTransition>
        {type === 'modal' && (
          <ModalDialog onClose={() => setType(undefined)}>
            <ModalBody>{popupSelectElement}</ModalBody>
          </ModalDialog>
        )}
      </ModalTransition>
    </>
  );
};

export default SelectPopupModalExample;
