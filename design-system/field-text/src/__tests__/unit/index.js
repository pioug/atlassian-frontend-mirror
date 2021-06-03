import React from 'react';
import { shallow, mount } from 'enzyme';
import Base from '@atlaskit/field-base';

import FieldText from '../..';
import FieldTextStatelessWithAnalytics, {
  FieldTextStatelessWithoutAnalytics as FieldTextStateless,
} from '../../FieldTextStateless';
import Input from '../../styled/Input';

describe('FieldTextStateless', () => {
  // Stub window.cancelAnimationFrame, so Popper (used in Layer) doesn't error when accessing it.
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  it('defaults', () => {
    const wrapper = shallow(<FieldTextStateless label="" />);
    expect(wrapper.find(Base).length).toBe(1);
    expect(wrapper.find(Input).length).toBe(1);
  });

  describe('properties', () => {
    describe('compact prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" compact />)
            .find(Base)
            .props().isCompact,
        ).toBe(true);
      });
    });

    describe('disabled prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" disabled />)
            .find(Base)
            .props().isDisabled,
        ).toBe(true);
      });
    });

    describe('isReadOnly prop', () => {
      describe('set to true', () => {
        it('should sets its value on the input', () => {
          expect(
            mount(<FieldText label="" isReadOnly />)
              .find('input')
              .props().readOnly,
          ).toBe(true);
        });

        it('should reflect its value to the FieldBase', () => {
          expect(
            mount(<FieldText label="" isReadOnly />)
              .find(Base)
              .props().isReadOnly,
          ).toBe(true);
        });
      });

      describe('set to false', () => {
        it('should sets its value on the input', () => {
          expect(
            mount(<FieldText label="" />)
              .find('input')
              .props().readOnly,
          ).toBe(false);
        });

        it('should reflect its value to the FieldBase', () => {
          expect(
            mount(<FieldText label="" />)
              .find(Base)
              .props().isReadOnly,
          ).toBe(false);
        });
      });
    });

    describe('required prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" required />)
            .find(Base)
            .props().isRequired,
        ).toBe(true);
      });
    });

    describe('isInvalid prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" isInvalid />)
            .find(Base)
            .props().isInvalid,
        ).toBe(true);
      });
    });

    describe('spellCheck prop', () => {
      it('should render an input with a spellCheck prop', () => {
        expect(
          shallow(<FieldTextStateless label="" isSpellCheckEnabled />)
            .find(Input)
            .props().spellCheck,
        ).toBe(true);
      });
    });

    describe('isMonospaced prop', () => {
      it('should render an input with an isMonospaced prop', () => {
        expect(
          shallow(<FieldTextStateless label="" isMonospaced />)
            .find(Input)
            .props().isMonospaced,
        ).toBe(true);
      });
    });

    describe('invalidMessage prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(<FieldTextStateless label="" invalidMessage="test" />)
            .find(Base)
            .props().invalidMessage,
        ).toBe('test');
      });
    });

    it('should reflect native input attributes on input element', () => {
      const props = {
        type: 'search',
        disabled: true,
        name: 'test',
        placeholder: 'test placeholder',
        maxLength: 5,
        min: 1,
        max: 10,
        required: true,
        autoComplete: 'on',
        form: 'my-form',
        pattern: '/.+/',
      };
      expect(
        shallow(<FieldTextStateless label="" {...props} />)
          .find(Input)
          .props(),
      ).toEqual(expect.objectContaining(props));
    });

    describe('native input events', () => {
      [
        'onBlur',
        'onChange',
        'onFocus',
        'onKeyDown',
        'onKeyPress',
        'onKeyUp',
      ].forEach((inputEvent) => {
        it(inputEvent, () => {
          const eventSpy = jest.fn();
          const wrapper = shallow(
            <FieldTextStateless label="" {...{ [inputEvent]: eventSpy }} />,
          );
          const input = wrapper.find(Input);
          expect(input.prop(inputEvent)).toBe(eventSpy);

          const simulateEvent = inputEvent.replace(/^on/, '').toLowerCase();
          input.simulate(simulateEvent);

          expect(eventSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    it('Input should have value="something"', () =>
      expect(
        shallow(<FieldTextStateless label="" value="something" />)
          .find(Input)
          .prop('value'),
      ).toBe('something'));

    it('onChange should be called when input value changes', () => {
      const spy = jest.fn();
      const wrapper = mount(<FieldTextStateless label="" onChange={spy} />);
      wrapper.find(Input).simulate('change');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('FieldText', () => {
    it('should call onChange when input value changes', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <FieldText label="" value="something" onChange={spy} />,
      );
      wrapper.find(Input).simulate('change');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('FieldText input focus', () => {
    it('should get focus when focus() is called', () => {
      const focusSpy = jest.fn();
      const wrapper = mount(<FieldText label="" onFocus={focusSpy} />);

      // The onFocus prop doesn't actualy get fired by enzyme for some reason, so attaching
      // the spy directly to the input.
      wrapper.find('input').getDOMNode().addEventListener('focus', focusSpy);

      expect(focusSpy).toHaveBeenCalledTimes(0);
      wrapper.instance().focus();
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('FieldTextStatelessWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<FieldTextStatelessWithAnalytics label="" />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
