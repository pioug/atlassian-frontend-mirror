import React from 'react';
import { mount } from 'enzyme';

import Btn from '../../Btn';
import Heading from '../../Heading';
import { MonthAndYear } from '../../../styled/Heading';

interface PredefinedHeadingProps {
  handleClickNext?: () => void;
  handleClickPrev?: () => void;
}

const PredefinedHeading = (props: PredefinedHeadingProps) => (
  <Heading monthLongTitle="January" year={2000} {...props} />
);

test('render', () => {
  const wrapper = mount(<PredefinedHeading />);
  expect(wrapper.find(Btn).length).toEqual(2);
  expect(wrapper.find(MonthAndYear).text()).toEqual('January 2000');
});

test('handleClickNext / handleClickPrev', () => {
  const mockHandleClickNext = jest.fn();
  const mockHandleClickPrev = jest.fn();
  const wrapper = mount(
    <PredefinedHeading
      handleClickNext={mockHandleClickNext}
      handleClickPrev={mockHandleClickPrev}
    />,
  );

  wrapper
    .find(Btn)
    .at(0)
    .simulate('click');
  expect(mockHandleClickPrev).toHaveBeenCalledTimes(1);

  wrapper
    .find(Btn)
    .at(1)
    .simulate('click');
  expect(mockHandleClickNext).toHaveBeenCalledTimes(1);
});
