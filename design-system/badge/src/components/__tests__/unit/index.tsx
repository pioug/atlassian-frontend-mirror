import React from 'react';

import { mount } from 'enzyme';

import Format from '../../Format';
import Badge from '../../index';

function getFormatProps(badge: React.ReactElement<any>) {
  return mount(badge).find(Format).props();
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
