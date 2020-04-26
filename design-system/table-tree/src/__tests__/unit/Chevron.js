import React from 'react';

import { mount } from 'enzyme';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import Chevron from '../../components/Chevron';

const controlledId = 'controlled_element_id';

test('accessibility', () => {
  const wrapper = mount(
    <Chevron ariaControls={controlledId} isExpanded={false} />,
  );
  const button = wrapper.find('button');
  expect(button).toHaveLength(1);
  expect(button.props()).toHaveProperty('aria-controls', controlledId);
});

test('expanded', () => {
  const wrapper = mount(<Chevron ariaControls={controlledId} isExpanded />);
  const button = wrapper.find('button');
  expect(button.find(ChevronRightIcon)).toHaveLength(0);
  expect(button.find(ChevronDownIcon)).toHaveLength(1);
});

test('collapsed', () => {
  const wrapper = mount(
    <Chevron ariaControls={controlledId} isExpanded={false} />,
  );
  const button = wrapper.find('button');
  expect(button.find(ChevronRightIcon)).toHaveLength(1);
  expect(button.find(ChevronDownIcon)).toHaveLength(0);
});

test('onExpandToggle', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <Chevron
      ariaControls={controlledId}
      isExpanded={false}
      onExpandToggle={spy}
    />,
  );
  const button = wrapper.find('button');
  button.simulate('click');
  expect(spy).toHaveBeenCalled();
});
