import React from 'react';

import { mount } from 'enzyme';

import UnsupportedBlockNode from '../../../ui/UnsupportedBlock';
import UnsupportedInlineNode from '../../../ui/UnsupportedInline';

describe('Unsupported Content', () => {
  describe('Block Node', () => {
    it('should return a node of type div', () => {
      const wrapper = mount(<UnsupportedBlockNode />);
      expect(wrapper.getDOMNode().tagName).toEqual('DIV');
      wrapper.unmount();
    });

    it('should have text content as string "Unsupported content"', () => {
      const wrapper = mount(<UnsupportedBlockNode />);
      expect(wrapper.text()).toEqual('Unsupported content');
      wrapper.unmount();
    });
  });
  describe('Inline Node', () => {
    it('should return a node of type span', () => {
      const wrapper = mount(<UnsupportedInlineNode />);
      expect(wrapper.getDOMNode().tagName).toEqual('SPAN');
      wrapper.unmount();
    });

    it('should have text content as string "Unsupported content"', () => {
      const wrapper = mount(<UnsupportedInlineNode />);
      expect(wrapper.text()).toEqual(
        'Unsupported content' + String.fromCharCode(8203),
      );
      wrapper.unmount();
    });
  });
});
