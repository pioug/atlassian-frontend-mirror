import React from 'react';
import { shallow } from 'enzyme';
import InlineDialog from '@atlaskit/inline-dialog';
import StatefulInlineDialog from '../../components/StatefulInlineDialog';

const render = (props = {}) =>
  shallow(
    <StatefulInlineDialog content={<div id="content" />} {...props}>
      <div id="trigger" />
    </StatefulInlineDialog>,
  );

test('dialog should render closed by default', () => {
  const wrapper = render();
  expect(wrapper.find(InlineDialog).props()).toMatchObject({ isOpen: false });
});

test('dialog should render on hover', () => {
  const wrapper = render();
  wrapper.find('div#trigger').parent().simulate('mouseover');
  expect(wrapper.find(InlineDialog).props()).toMatchObject({ isOpen: true });
});
