import React from 'react';
import { renderToString } from 'react-dom/server';
import { Consumer, Provider } from '../../Context';

test('Consumer', () => {
  expect(typeof Consumer).toBe('object');
  expect(
    renderToString(<Consumer>{JSON.stringify}</Consumer>),
  ).toMatchSnapshot();
});

test('Provider', () => {
  expect(typeof Provider).toBe('object');
});
