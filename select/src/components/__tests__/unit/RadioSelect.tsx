import React from 'react';
import { mount } from 'enzyme';

import Select from 'react-select';
import AtlaskitRadioSelect from '../../../RadioSelect';

const OPTIONS = [
  { label: '0', value: 'zero' },
  { label: '1', value: 'one' },
  { label: '2', value: 'two' },
  { label: '3', value: 'three' },
  { label: '4', value: 'four' },
];

test('loads radio icon with option', () => {
  const atlaskitRadioSelect = mount(
    <AtlaskitRadioSelect menuIsOpen options={OPTIONS} />,
  );
  expect(atlaskitRadioSelect.find('RadioIcon').length).toBe(5);
});

test('to be a single select', () => {
  const atlaskitRadioSelect = mount(
    <AtlaskitRadioSelect menuIsOpen options={OPTIONS} />,
  );
  expect(atlaskitRadioSelect.find(Select).props().isMulti).toBe(false);
});
