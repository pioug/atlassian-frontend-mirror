import React from 'react';
import { mount } from 'enzyme';

import AtlaskitSelect from '../../..';

const OPTIONS = [
  { label: '0', value: 'zero' },
  { label: '1', value: 'one' },
  { label: '2', value: 'two' },
  { label: '3', value: 'three' },
  { label: '4', value: 'four' },
];
// temporarily skip this test as part of DST-2476 resolution
test.skip('loading the animated component as default', () => {
  const atlaskitSelectWrapper = mount(<AtlaskitSelect />);
  expect(atlaskitSelectWrapper.find('Transition').exists()).toBeTruthy();
});

test('clicking on dropdown indicator should toggle the menu', () => {
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelect classNamePrefix="react-select" />,
  );
  // console.log(atlaskitSelectWrapper.debug());
  // Menu open by default
  expect(atlaskitSelectWrapper.find('Menu').exists()).toBeFalsy();
  atlaskitSelectWrapper
    .find('div.react-select__dropdown-indicator')
    .simulate('mouseDown', { button: 0 });
  // Menu to open
  expect(atlaskitSelectWrapper.find('Menu').exists()).toBeTruthy();
});

test('single AtlaskitSelect > should show the default AtlaskitSelected value', () => {
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelect options={OPTIONS} value={OPTIONS[0]} />,
  );
  // Display the provided value
  expect(atlaskitSelectWrapper.find('Control').text()).toBe('0');
});

test('multi AtlaskitSelect > should show the default AtlaskitSelected value', () => {
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelect
      options={OPTIONS}
      isMulti
      value={[OPTIONS[0], OPTIONS[3]]}
    />,
  );
  expect(atlaskitSelectWrapper.find('Control').text()).toBe('03');
});

test('display options with group inside Menu (when menu is Open)', () => {
  const options = [
    {
      label: 'test',
      options: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
      ],
    },
  ];
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelect options={options} menuIsOpen />,
  );
  expect(atlaskitSelectWrapper.find('Group').length).toBe(1);
  expect(atlaskitSelectWrapper.find('Option').length).toBe(2);
  expect(atlaskitSelectWrapper.find('Group').find('Option').length).toBe(2);
});

test('to only render groups with at least one match when filtering', () => {
  const options = [
    {
      label: 'group 1',
      options: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
      ],
    },
    {
      label: 'group 2',
      options: [
        { value: 3, label: '3' },
        { value: 4, label: '4' },
      ],
    },
  ];
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelect options={options} menuIsOpen />,
  );
  atlaskitSelectWrapper.setProps({ inputValue: '1' });

  expect(atlaskitSelectWrapper.find('Group').length).toBe(1);
  expect(atlaskitSelectWrapper.find('Group').find('Option').length).toBe(1);
});

test('not render any groups when there is not a single match when filtering', () => {
  const options = [
    {
      label: 'group 1',
      options: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
      ],
    },
    {
      label: 'group 2',
      options: [
        { value: 3, label: '3' },
        { value: 4, label: '4' },
      ],
    },
  ];
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelect options={options} menuIsOpen />,
  );
  atlaskitSelectWrapper.setProps({ inputValue: '5' });

  expect(atlaskitSelectWrapper.find('Group').length).toBe(0);
});

test('to autoFocus the AtlaskitSelect', () => {
  const rootElement = document.createElement('div');
  document.body.appendChild(rootElement);
  const atlaskitSelectWrapper = mount(<AtlaskitSelect autoFocus />, {
    attachTo: rootElement,
  });
  const activeElementId = document.activeElement && document.activeElement.id;
  expect(atlaskitSelectWrapper.find('Control input').props().id).toBe(
    activeElementId,
  );
  atlaskitSelectWrapper.unmount();
  document.body.removeChild(rootElement);
});

test('pass the className prop down to react-select', () => {
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelect className="custom-class-name" />,
  );
  expect(atlaskitSelectWrapper.find('Select').props().className).toBe(
    'custom-class-name',
  );
});

test('renders a hidden form field when name is passed', () => {
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelect name="test-name" className="custom-class-name" />,
  );
  expect(
    atlaskitSelectWrapper.find('input[name="test-name"]').exists(),
  ).toBeTruthy();
  expect(
    atlaskitSelectWrapper.find('input[name="test-name"]').props().type,
  ).toBe('hidden');
});

/**
 * filterOption is getting called multiple for a change in inputValue
 */
/* eslint-disable jest/no-disabled-tests */
test.skip('filterOption is called when input of select is changed', () => {
  const filterOptionSpy = jest.fn();
  const atlaskitSelectWrapper = mount(
    <AtlaskitSelect options={OPTIONS} filterOption={filterOptionSpy} />,
  );
  atlaskitSelectWrapper.setProps({ inputValue: '5' });
  atlaskitSelectWrapper.setProps({ inputValue: '1' });
  expect(filterOptionSpy).toHaveBeenCalledTimes(2);
});
/* eslint-enable */
