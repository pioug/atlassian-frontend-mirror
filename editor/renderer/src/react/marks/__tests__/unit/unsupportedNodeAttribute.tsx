import UnsupportedNodeAttribute from '../../unsupportedNodeAttribute';
import { shallow, ShallowWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import React from 'react';

describe('UnsupportedNodeAttribute', () => {
  const DummyComponent = () => <p>Hello</p>;

  it('should wrap the passed contents in a span', () => {
    let wrapper: ShallowWrapper;
    act(() => {
      wrapper = shallow(
        <UnsupportedNodeAttribute
          dataAttributes={{ 'data-renderer-mark': true }}
          children={<DummyComponent />}
        />,
      );
    });
    expect(wrapper!.find('span')).not.toHaveLength(0);
    expect(wrapper!.find('span').prop('data-renderer-mark')).toBe(true);
    expect(wrapper!.find('span').find('DummyComponent')).not.toHaveLength(0);
  });
});
