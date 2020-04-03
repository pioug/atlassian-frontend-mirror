import { shallow } from 'enzyme';
import React from 'react';
import Container from '../../Container';

test('snapshot', () => {
  const wrapper = shallow(
    <Container backgroundColor="#000" textColor="#fff" />,
  );

  expect(wrapper).toMatchSnapshot();
});
