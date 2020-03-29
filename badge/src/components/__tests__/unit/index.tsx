import { mount } from 'enzyme';
import React from 'react';
import Badge from '../..';
import Format from '../../Format';

function getFormatProps(badge: React.ReactElement<any>) {
  return mount(badge)
    .find(Format)
    .props();
}

test('snapshot', () => {
  expect(mount(<Badge />)).toMatchSnapshot();
});

test('children', () => {
  expect(getFormatProps(<Badge>{100}</Badge>)).toMatchObject({ children: 100 });
});

test('using a string', () => {
  expect(mount(<Badge>+100</Badge>).props()).toMatchObject({
    children: '+100',
  });
});
