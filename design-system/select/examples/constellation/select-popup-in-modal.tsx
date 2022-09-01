import React from 'react';
import ModalDialog, {
  ModalTransition,
  ModalBody,
} from '@atlaskit/modal-dialog';
import Drawer from '@atlaskit/drawer';
import Button from '@atlaskit/button/standard-button';
import { RadioGroup } from '@atlaskit/radio';
import { OptionsPropType } from '@atlaskit/radio/types';

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [type, setType] = React.useState('modal');

  const select = (
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
      target={({ ref }) => <Button ref={ref}>Choose</Button>}
    />
  );

  const radio_options: OptionsPropType = [
    { name: 'modal', value: 'modal', label: 'Modal' },
    { name: 'drawer', value: 'drawer', label: 'Drawer' },
  ];

  return (
    <>
      <div>
        <RadioGroup
          defaultValue={'modal'}
          options={radio_options}
          onChange={(e) => setType(e.target.value)}
          aria-labelledby="radiogroup-label"
        />
      </div>

      <Button appearance="primary" onClick={() => setIsOpen(true)}>
        Open Select
      </Button>

      {type === 'drawer' && (
        <Drawer onClose={() => setIsOpen(false)} isOpen={isOpen}>
          {select}
        </Drawer>
      )}

      <ModalTransition>
        {type === 'modal' && isOpen && (
          <ModalDialog onClose={() => setIsOpen(false)}>
            <ModalBody>{select}</ModalBody>
          </ModalDialog>
        )}
      </ModalTransition>
    </>
  );
};

export default SelectPopupModalExample;
