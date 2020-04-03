import React from 'react';
import { mount } from 'enzyme';
import ReactUnsupportedInlineNode from '../../../../../plugins/unsupported-content/nodeviews/unsupported-inline';

describe('unsupportedInline - React component', () => {
  it('should return a node of type span', () => {
    const wrapper = mount(<ReactUnsupportedInlineNode />);
    expect(wrapper.getDOMNode().tagName).toEqual('SPAN');
    wrapper.unmount();
  });

  it('should have text content as string "Unsupported content"', () => {
    const wrapper = mount(<ReactUnsupportedInlineNode />);
    expect(wrapper.text()).toEqual(
      'Unsupported content' + String.fromCharCode(8203),
    );
    wrapper.unmount();
  });
});
