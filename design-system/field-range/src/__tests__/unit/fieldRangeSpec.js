import React from 'react';
import { mount } from 'enzyme';
import FieldRange from '../../FieldRange';

describe('FieldRange', () => {
  describe('with default props', () => {
    let fieldRange;

    beforeEach(() => {
      fieldRange = mount(<FieldRange value={20.12} />);
    });

    it('should have input with type "range"', () => {
      const input = fieldRange.find('input');
      expect(input.props().type).toBe('range');
    });

    it('should have percent value on styled component', () => {
      const input = fieldRange.find('InputRange');
      expect(input.props().valuePercent).toBe('20.12');
    });

    it('should have min, max, step and valuePercent set to default values', () => {
      const input = fieldRange.find('input');
      expect(input.props().min).toBe(0);
      expect(input.props().max).toBe(100);
      expect(input.props().step).toBe(0.1);
    });

    it('should input with defined value', () => {
      const input = fieldRange.find('input');
      expect(input.props().value).toBe('20.12');
    });

    it('should not be disabled by default', () => {
      fieldRange.setProps({ disabled: false });
      const input = fieldRange.find('input');
      expect(input.props().disabled).toBeFalsy();
    });
  });

  describe('with defined props', () => {
    let fieldRange;
    let onChangeSpy;

    beforeEach(() => {
      onChangeSpy = jest.fn();
      fieldRange = mount(
        <FieldRange value={25} min={10} max={20} onChange={onChangeSpy} />,
      );
    });

    it('should have defined min and max values', () => {
      const input = fieldRange.find('input');
      expect(input.props().min).toBe(10);
      expect(input.props().max).toBe(20);
    });

    it('should call spy when value is changed', () => {
      fieldRange.find('input').simulate('change');
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should change input value when prop is changed', () => {
      fieldRange.setProps({ value: 15 });
      const input = fieldRange.find('input');
      expect(input.props().value).toBe('15');
    });

    it('should be disabled if disabled prop is truthy', () => {
      fieldRange.setProps({ disabled: true });
      const input = fieldRange.find('input');
      expect(input.props().disabled).toBeTruthy();
    });

    it('should not be disabled if disabled prop is falsy', () => {
      fieldRange.setProps({ disabled: false });
      const input = fieldRange.find('input');
      expect(input.props().disabled).toBeFalsy();
    });
  });
  describe('range value percentage', () => {
    let fieldRange;
    it('should calculate the correct value percent for non 0 min and max != 100', () => {
      fieldRange = mount(<FieldRange value={50} min={30} max={80} />);
      const input = fieldRange.find('InputRange');
      expect(input.props().valuePercent).toBe('40.00');
    });
    it('should calculate the correct value percent for 0 min and max != 100', () => {
      fieldRange = mount(<FieldRange value={50} min={0} max={80} />);
      const input = fieldRange.find('InputRange');
      expect(input.props().valuePercent).toBe('62.50');
    });
    it('should calculate the correct value as 0 if min > max', () => {
      fieldRange = mount(<FieldRange value={50} min={150} max={100} />);
      const input = fieldRange.find('InputRange');
      expect(input.props().valuePercent).toBe('0');
    });
    it('should calculate the correct value for negative range', () => {
      fieldRange = mount(<FieldRange value={0} min={-50} max={50} />);
      const input = fieldRange.find('InputRange');
      expect(input.props().valuePercent).toBe('50.00');
    });
    it('should update the value when props change', () => {
      fieldRange = mount(<FieldRange value={50} min={0} max={100} />);
      expect(fieldRange.find('InputRange').prop('valuePercent')).toBe('50.00');
      fieldRange.setProps({ value: 25 });
      expect(fieldRange.find('InputRange').prop('valuePercent')).toBe('25.00');
    });
  });
});
