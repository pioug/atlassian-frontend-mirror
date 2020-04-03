import React from 'react';
import { mount } from 'enzyme';

import Select from '../../../';
import AtlaskitCheckboxSelect from '../../../CheckboxSelect';

const OPTIONS = [
  { label: '0', value: 'zero' },
  { label: '1', value: 'one' },
  { label: '2', value: 'two' },
  { label: '3', value: 'three' },
  { label: '4', value: 'four' },
];

test('to show checkbox icon with every option', () => {
  const atlaskitCheckboxSelect = mount(
    <AtlaskitCheckboxSelect menuIsOpen options={OPTIONS} />,
  );
  expect(atlaskitCheckboxSelect.find('CheckboxIcon').length).toBe(5);
});

test('to be a multi select', () => {
  const atlaskitCheckboxSelect = mount(
    <AtlaskitCheckboxSelect menuIsOpen options={OPTIONS} />,
  );
  expect(atlaskitCheckboxSelect.find(Select).props().isMulti).toBe(true);
});
