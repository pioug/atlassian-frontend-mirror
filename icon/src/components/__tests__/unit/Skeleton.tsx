import React from 'react';
import { shallow } from 'enzyme';

import Skeleton from '../../Skeleton';

test('sets color as currentColor by default', () => {
  expect(shallow(<Skeleton />)).toHaveStyleRule(
    'background-color',
    'currentColor',
  );
});

test('sets color from prop', () => {
  expect(shallow(<Skeleton color="#FFFFFF" />)).toHaveStyleRule(
    'background-color',
    '#FFFFFF',
  );
});

test('sets a default opacity', () => {
  expect(shallow(<Skeleton />)).toHaveStyleRule('opacity', '0.15');
});

test('sets a strong opacity when prop specified', () => {
  expect(shallow(<Skeleton weight="strong" />)).toHaveStyleRule(
    'opacity',
    '0.3',
  );
});
