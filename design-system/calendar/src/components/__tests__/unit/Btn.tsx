import React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';

import Btn from '../../Btn';

test('children', () => {
  const wrapper = mount(
    <Btn>
      <ArrowleftIcon label="left arrow" />
    </Btn>,
  );
  const props = wrapper.find(Button).props();
  expect(props).toEqual(
    expect.objectContaining({
      appearance: 'subtle',
      spacing: 'none',
      tabIndex: -1,
      iconBefore: <ArrowleftIcon label="left arrow" />,
    }),
  );
});

test('onClick', () => {
  const mockOnClick = jest.fn();
  const wrapper = mount(<Btn onClick={mockOnClick} />);
  wrapper.simulate('click');
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
