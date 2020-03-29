import React from 'react';
import { shallow } from 'enzyme';
import Format from '../../Format';

test('snapshot', () => {
  expect(shallow(<Format />)).toMatchSnapshot();
});

test('default', () => {
  expect(shallow(<Format />).text()).toBe('0');
});

test('children', () => {
  expect(shallow(<Format>{-100}</Format>).text()).toBe('0');
  expect(shallow(<Format>{0}</Format>).text()).toBe('0');
  expect(shallow(<Format>{100}</Format>).text()).toBe('100');
});

test('max', () => {
  // Negatives
  expect(shallow(<Format max={-100}>{-10}</Format>).text()).toBe('0');
  expect(shallow(<Format max={-100}>{-1000}</Format>).text()).toBe('0');
  expect(shallow(<Format max={Infinity}>{-1000}</Format>).text()).toBe('0');

  // Zero
  expect(shallow(<Format max={-100}>{0}</Format>).text()).toBe('0');
  expect(shallow(<Format max={100}>{0}</Format>).text()).toBe('0');
  expect(shallow(<Format max={Infinity}>{0}</Format>).text()).toBe('0');

  // Positives
  expect(shallow(<Format max={100}>{10}</Format>).text()).toBe('10');
  expect(shallow(<Format max={100}>{1000}</Format>).text()).toBe('100+');
  expect(shallow(<Format max={Infinity}>{1000}</Format>).text()).toBe('1000');
});

test('infinity', () => {
  expect(shallow(<Format>{Infinity}</Format>).text()).toBe('∞');
  expect(shallow(<Format max={-100}>{Infinity}</Format>).text()).toBe('∞');
  expect(shallow(<Format max={100}>{Infinity}</Format>).text()).toBe('100+');
  expect(shallow(<Format max={Infinity}>{Infinity}</Format>).text()).toBe('∞');
});
