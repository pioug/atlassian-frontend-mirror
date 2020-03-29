/* eslint-disable no-undef, import/no-extraneous-dependencies */
import React from 'react';
import { mount } from 'enzyme';
import Range from '../..';

describe('Range', () => {
  describe('with default props', () => {
    it('should have input with interface "range"', () => {
      const range = mount(<Range value={20.12} />);
      const input = range.find('input');
      expect(input.props().type).toBe('range');
    });

    it('should have percent value on styled component', () => {
      const range = mount(<Range value={20.12} />);
      const input: any = range.find('InputRange');
      expect(input.props().valuePercent).toBe('20.12');
    });

    it('should have min, max, step and valuePercent set to default values', () => {
      const range = mount(<Range value={20.12} />);
      const input = range.find('input');
      expect(input.props().min).toBe(0);
      expect(input.props().max).toBe(100);
      expect(input.props().step).toBe(1);
    });

    it('should input with defined value', () => {
      const range = mount(<Range value={20.12} />);
      const input = range.find('input');
      expect(input.props().value).toBe(20.12);
    });

    it('should not be disabled by default', () => {
      const range = mount(<Range value={20.12} />);
      range.setProps({ isDisabled: false });
      const input = range.find('input');
      expect(input.props().disabled).toBe(false);
    });
  });

  describe('with defined props', () => {
    let onChangeSpy: any;

    beforeEach(() => {
      onChangeSpy = jest.fn();
    });

    it('should have defined min and max values', () => {
      const range = mount(
        <Range value={25} min={10} max={20} onChange={onChangeSpy} />,
      );
      const input = range.find('input');
      expect(input.props().min).toBe(10);
      expect(input.props().max).toBe(20);
    });

    it('should call spy when value is changed', () => {
      const range = mount(
        <Range value={25} min={10} max={20} onChange={onChangeSpy} />,
      );
      range.find('input').simulate('change');
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should change input value when prop is changed', () => {
      const range = mount(
        <Range value={25} min={10} max={20} onChange={onChangeSpy} />,
      );
      range.setProps({ value: 15 });
      const input = range.find('input');
      expect(input.props().value).toBe(15);
    });

    it('should be disabled if isDisabled prop is truthy', () => {
      const range = mount(
        <Range value={25} min={10} max={20} onChange={onChangeSpy} />,
      );
      range.setProps({ isDisabled: true });
      const input = range.find('input');
      expect(input.props().disabled).toBe(true);
    });

    it('should not be disabled if isDisabled prop is falsy', () => {
      const range = mount(
        <Range value={25} min={10} max={20} onChange={onChangeSpy} />,
      );
      range.setProps({ isDisabled: false });
      const input = range.find('input');
      expect(input.props().disabled).toBe(false);
    });

    it('hould pass all the extra props passed down to hidden input', () => {
      const range = mount(
        <Range value={25} min={10} max={20} onChange={onChangeSpy} />,
      );
      range.setProps({ 'data-foo': 'range-bar' });
      const input = range.find('input');
      expect(input.prop('data-foo')).toBe('range-bar');
    });
  });
  describe('range value percentage', () => {
    it('should calculate the correct value percent for non 0 min and max != 100', () => {
      const range = mount(<Range value={50} min={30} max={80} />);
      const input: any = range.find('InputRange');
      expect(input.props().valuePercent).toBe('40.00');
    });
    it('should calculate the correct value percent for 0 min and max != 100', () => {
      const range = mount(<Range value={50} min={0} max={80} />);
      const input: any = range.find('InputRange');
      expect(input.props().valuePercent).toBe('62.50');
    });
    it('should calculate the correct value as 0 if min > max', () => {
      const range = mount(<Range value={50} min={150} max={100} />);
      const input: any = range.find('InputRange');
      expect(input.props().valuePercent).toBe('0');
    });
    it('should calculate the correct value for negative range', () => {
      const range = mount(<Range value={0} min={-50} max={50} />);
      const input: any = range.find('InputRange');
      expect(input.props().valuePercent).toBe('50.00');
    });
    it('should update the value when props change', () => {
      const range = mount(<Range value={50} min={0} max={100} />);
      expect(range.find('InputRange').prop('valuePercent')).toBe('50.00');
      range.setProps({ value: 25 });
      expect(range.find('InputRange').prop('valuePercent')).toBe('25.00');
    });
  });
});
