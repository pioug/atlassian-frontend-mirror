import { shallow } from 'enzyme';
import React from 'react';
import { DateDiv } from '../../Date';

test('cursor should be "default"', () => {
  expect(shallow(<DateDiv />)).toHaveStyleRule('cursor', 'pointer');
});

test('disabled - cursor should be "not-allowed"', () => {
  expect(shallow(<DateDiv disabled />)).toHaveStyleRule(
    'cursor',
    'not-allowed',
  );
});
