import React from 'react';
import { shallow } from 'enzyme';
import { TickBox } from '../tickBox';
import { Wrapper } from '../styled';
import TickIcon from '@atlaskit/icon/glyph/check';

describe('TickBox', () => {
  it('should render TickBox properly', () => {
    const tickBox = shallow(<TickBox selected />);
    const wrapper = tickBox.find(Wrapper);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('selected')).toBe(true);
    expect(tickBox.find(TickIcon)).toHaveLength(1);
  });
});
