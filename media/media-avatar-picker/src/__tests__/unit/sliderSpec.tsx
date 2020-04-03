import React from 'react';
import { shallow } from 'enzyme';
import FieldRange from '@atlaskit/range';
import {
  Slider,
  SliderProps,
  defaultProps,
} from '../../image-navigator/slider';

describe('Slider', () => {
  const setup = (props: Partial<SliderProps> = defaultProps) => {
    const onChange = jest.fn();
    const element = shallow(<Slider onChange={onChange} {...props} />);
    return {
      element,
      onChange,
    };
  };

  it('should pass FieldRange values back', () => {
    const { element, onChange } = setup();
    const fieldRange = element.find(FieldRange);
    fieldRange.prop('onChange')!(25);
    expect(onChange).toHaveBeenCalledWith(25);
  });

  it('should zoom to 0 when small icon clicked', () => {
    const { element, onChange } = setup();
    element.find('.zoom_button_small').simulate('click');
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('should zoom to 100 when large icon clicked', () => {
    const { element, onChange } = setup();
    element.find('.zoom_button_large').simulate('click');
    expect(onChange).toHaveBeenCalledWith(100);
  });
});
