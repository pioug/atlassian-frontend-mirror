import React from 'react';
import Dropdown, {
  DropdownItemCheckbox,
  DropdownItemGroupCheckbox,
  DropdownItemRadio,
  DropdownItemGroupRadio,
} from '../src';

export default () => (
  <Dropdown defaultOpen triggerType="button" trigger="Drop menu">
    <DropdownItemGroupRadio id="languages" title="Languages">
      <DropdownItemRadio defaultSelected id="js-radio">
        JavaScript
      </DropdownItemRadio>
      <DropdownItemRadio id="java">Java</DropdownItemRadio>
      <DropdownItemRadio id="ruby">Ruby</DropdownItemRadio>
    </DropdownItemGroupRadio>
    ,
    <DropdownItemGroupCheckbox id="languages2" title="Languages">
      <DropdownItemCheckbox defaultSelected id="js-check">
        JavaScript
      </DropdownItemCheckbox>
      <DropdownItemCheckbox id="java">Java</DropdownItemCheckbox>
      <DropdownItemCheckbox defaultSelected id="ruby">
        Ruby
      </DropdownItemCheckbox>
    </DropdownItemGroupCheckbox>
  </Dropdown>
);
