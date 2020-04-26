import React from 'react';

import { shallow } from 'enzyme';

import Container from '../../Container';

test('snapshot', () => {
  const wrapper = shallow(
    <Container backgroundColor="#000" textColor="#fff" />,
  );

  expect(wrapper).toMatchSnapshot();
});
