import React from 'react';
import type { OptionType, SelectProps } from '@atlaskit/select';
import { shallow, mount } from 'enzyme';
import { render } from '@testing-library/react';
import { Input } from '../../../components/Input';
import { AriaAttributesType } from '../../../types';

describe('ClearIndicator', () => {
  const shallowInput = (props: any) => shallow(<Input {...props} />);
  const noop = () => {};

  const labelledById = 'test-labelledby';
  const describedById = 'test-described';

  type MockProps = {
    selectProps: SelectProps<OptionType, boolean>;
    innerRef: (ref: React.Ref<HTMLInputElement>) => void;
    cx: () => void;
    getStyles: () => void;
    'aria-describedby'?: AriaAttributesType;
    'aria-labelledby'?: AriaAttributesType;
  };
  let mockedProps: MockProps;

  beforeEach(() => {
    mockedProps = {
      innerRef(ref: React.Ref<HTMLInputElement>): void {},
      selectProps: { disableInput: false },
      cx: noop,
      getStyles: noop,
    };
  });

  it('should be enabled by default', () => {
    const component = shallowInput({
      selectProps: {},
    });

    expect(component.prop('isDisabled')).toBeFalsy();
  });

  it('should fire event.preventDefault() if isDisabled', () => {
    mockedProps.selectProps.disableInput = true;

    const spiedPreventDefault = jest.fn();
    const component = mount(<Input {...mockedProps} />);
    component.find('input').simulate('keyPress', {
      key: 'a',
      preventDefault: spiedPreventDefault,
    });
    expect(spiedPreventDefault).toHaveBeenCalledTimes(1);
    // Backspace shoud still register for deleting selected users
    component.find('input').simulate('keyPress', {
      key: 'Backspace',
      preventDefault: spiedPreventDefault,
    });
    expect(spiedPreventDefault).toHaveBeenCalledTimes(2);
  });

  it('should fire event.preventDefault() only on `Enter` key pressed', () => {
    const spiedPreventDefault = jest.fn();
    const component = mount(<Input {...mockedProps} />);
    component.find('input').simulate('keyPress', {
      key: 'a',
      preventDefault: spiedPreventDefault,
    });
    expect(spiedPreventDefault).not.toHaveBeenCalled();
    component.find('input').simulate('keyPress', {
      key: 'Enter',
      preventDefault: spiedPreventDefault,
    });
    expect(spiedPreventDefault).toHaveBeenCalledTimes(1);
  });

  describe('aria-describedby', () => {
    const ariaSelector = '[aria-describedby]';

    it('should have no aria-describedby by default', () => {
      const { baseElement } = render(<Input {...mockedProps} />);

      const ariaAttr = baseElement.querySelector(ariaSelector);

      expect(ariaAttr).not.toBeInTheDocument();
    });

    it('should have aria-describedby if passed from selectProps', () => {
      mockedProps.selectProps = {
        'aria-describedby': describedById,
      };

      const { baseElement } = render(<Input {...mockedProps} />);

      const ariaAttr = baseElement.querySelector(ariaSelector);

      expect(ariaAttr).toBeInTheDocument();
    });

    it('should have aria-describedby from props if selectProps is not passed', () => {
      mockedProps = {
        ...mockedProps,
        'aria-describedby': describedById,
      };

      const { baseElement } = render(<Input {...mockedProps} />);

      const ariaAttr = baseElement.querySelector(ariaSelector);

      expect(ariaAttr).toBeInTheDocument();
    });
  });

  describe('aria-labelledby', () => {
    const ariaSelector = '[aria-labelledby]';

    it('should have no aria-labelledby by default', () => {
      const { baseElement } = render(<Input {...mockedProps} />);

      const ariaAttr = baseElement.querySelector(ariaSelector);

      expect(ariaAttr).not.toBeInTheDocument();
    });

    it('should have aria-labelledby from aria-describedby if passed', () => {
      mockedProps = {
        ...mockedProps,
        'aria-describedby': describedById,
        'aria-labelledby': labelledById,
      };

      const { baseElement } = render(<Input {...mockedProps} />);

      const ariaAttr = baseElement.querySelector(ariaSelector);

      expect(ariaAttr?.getAttribute('aria-labelledby')).toEqual(describedById);
    });

    it('should have aria-labelledby from props if aria-describedby is not passed', () => {
      mockedProps = {
        ...mockedProps,
        'aria-labelledby': labelledById,
      };

      const { baseElement } = render(<Input {...mockedProps} />);

      const ariaAttr = baseElement.querySelector(ariaSelector);

      expect(ariaAttr?.getAttribute('aria-labelledby')).toEqual(labelledById);
    });
  });
});
