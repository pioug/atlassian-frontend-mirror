import { shallow, mount } from 'enzyme';
import React from 'react';
import { Input } from '../../../components/Input';

describe('ClearIndicator', () => {
  const shallowInput = (props: any) => shallow(<Input {...props} />);

  it('should be enabled by default', () => {
    const component = shallowInput({
      selectProps: {},
    });

    expect(component.prop('isDisabled')).toBeFalsy();
  });

  it('should be disabled if disableInput select prop is passed in', () => {
    const component = shallowInput({
      selectProps: { disableInput: true },
    });

    expect(component.prop('isDisabled')).toBeTruthy();
  });

  it('should fire event.preventDefault() only on `Enter` key pressed', () => {
    const noop = () => {};
    const mockedProps = {
      innerRef: (ref: React.Ref<HTMLInputElement>) => {},
      getStyles: noop,
      cx: noop,
    };
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
});
