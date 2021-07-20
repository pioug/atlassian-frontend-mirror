import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Date, DateLozenge, DateProps } from '../../..';

describe('Date', () => {
  const shallowDate = (props: Partial<DateProps> = {}) =>
    shallow(<Date value={586137600000} {...props} />);

  const getText = (component: ShallowWrapper<DateProps>) =>
    component.find(DateLozenge).prop('children');

  describe('format', () => {
    it('should render date formated', () => {
      const component = shallowDate();

      expect(getText(component)).toEqual('29/07/1988');
    });

    it('should use custom format', () => {
      const component = shallowDate({ format: 'MM/dd/yyyy' });

      expect(getText(component)).toEqual('07/29/1988');
    });
  });

  it('should pass className to DateLozenge', () => {
    const component = shallowDate({ className: 'some-css-class' });
    expect(component.find(DateLozenge).prop('className')).toEqual(
      'some-css-class',
    );
  });

  describe('color', () => {
    it('should use default color', () => {
      const component = shallowDate();
      expect(component.find(DateLozenge).prop('color')).toEqual('grey');
    });

    it('should set custom color', () => {
      const component = shallowDate({ color: 'red' });
      expect(component.find(DateLozenge).prop('color')).toEqual('red');
    });
  });

  describe('onClick', () => {
    it('should not set onClick', () => {
      const component = shallowDate();
      expect(component.find(DateLozenge).prop('onClick')).toBeUndefined();
    });

    it('should not set onClick', () => {
      const onClick = jest.fn();
      const component = shallowDate({ onClick });

      const event = {};
      expect(component.find(DateLozenge).prop('onClick')).toBeDefined();
      component.find(DateLozenge).simulate('click', event);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(586137600000, event);
    });
  });

  describe('children', () => {
    it('should be formated value', () => {
      const component = shallowDate();
      expect(getText(component)).toEqual('29/07/1988');
    });

    it('should be children property', () => {
      const component = shallowDate({ children: '29 - 07 - 1988' });
      expect(getText(component)).toEqual('29 - 07 - 1988');
    });

    it('should be children property', () => {
      const children = jest.fn();
      children.mockReturnValueOnce('[29|07|1988]');
      const component = shallowDate({ children });
      expect(getText(component)).toEqual('[29|07|1988]');
    });
  });
});
