import React from 'react';
import { shallow, mount } from 'enzyme';
import Base from '@atlaskit/field-base';

import FieldTextArea from '../..';
import FieldTextAreaStatelessWithAnalytics, {
  FieldTextAreaStatelessWithoutAnalytics as FieldTextAreaStateless,
} from '../../FieldTextAreaStateless';
import TextArea from '../../styled/TextArea';

describe('FieldTextAreaStateless', () => {
  // Stub window.cancelAnimationFrame, so Popper (used in Layer) doesn't error when accessing it.
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  it('defaults', () => {
    const wrapper = shallow(
      <FieldTextAreaStateless onChange={() => {}} label="" />,
    );
    expect(wrapper.find(Base).length).toBe(1);
    expect(wrapper.find(TextArea).length).toBe(1);
  });

  describe('properties', () => {
    describe('compact prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(
            <FieldTextAreaStateless onChange={() => {}} compact label="" />,
          )
            .find(Base)
            .props().isCompact,
        ).toBe(true);
      });
    });

    describe('disabled prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(
            <FieldTextAreaStateless onChange={() => {}} disabled label="" />,
          )
            .find(Base)
            .props().isDisabled,
        ).toBe(true);
      });
    });

    describe('isReadOnly prop', () => {
      describe('set to true', () => {
        it('should sets its value on the input', () => {
          expect(
            mount(<FieldTextArea onChange={() => {}} isReadOnly label="" />)
              .find('textarea')
              .props().readOnly,
          ).toBe(true);
        });

        it('should reflect its value to the FieldBase', () => {
          expect(
            mount(<FieldTextArea onChange={() => {}} isReadOnly label="" />)
              .find(Base)
              .props().isReadOnly,
          ).toBe(true);
        });
      });

      describe('set to false', () => {
        it('should sets its value on the input', () => {
          expect(
            mount(<FieldTextArea onChange={() => {}} label="" />)
              .find('textarea')
              .props().readOnly,
          ).toBe(false);
        });

        it('should reflect its value to the FieldBase', () => {
          expect(
            mount(<FieldTextArea onChange={() => {}} label="" />)
              .find(Base)
              .props().isReadOnly,
          ).toBe(false);
        });
      });
    });

    describe('required prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(
            <FieldTextAreaStateless onChange={() => {}} required label="" />,
          )
            .find(Base)
            .props().isRequired,
        ).toBe(true);
      });
    });

    describe('isInvalid prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(
            <FieldTextAreaStateless onChange={() => {}} isInvalid label="" />,
          )
            .find(Base)
            .props().isInvalid,
        ).toBe(true);
      });
    });

    describe('spellCheck prop', () => {
      it('should render an input with a spellCheck prop', () => {
        expect(
          shallow(
            <FieldTextAreaStateless
              onChange={() => {}}
              isSpellCheckEnabled
              label=""
            />,
          )
            .find(TextArea)
            .props().spellCheck,
        ).toBe(true);
      });
    });

    describe('isMonospaced prop', () => {
      it('should render an input with an isMonospaced prop', () => {
        expect(
          shallow(
            <FieldTextAreaStateless
              onChange={() => {}}
              isMonospaced
              label=""
            />,
          )
            .find(TextArea)
            .props().isMonospaced,
        ).toBe(true);
      });
    });

    describe('invalidMessage prop', () => {
      it('should reflect its value to the FieldBase', () => {
        expect(
          shallow(
            <FieldTextAreaStateless
              onChange={() => {}}
              invalidMessage="test"
              label=""
            />,
          )
            .find(Base)
            .props().invalidMessage,
        ).toBe('test');
      });
    });

    [
      { disabled: true },
      { name: 'test' },
      { placeholder: 'test placeholder' },
      { maxLength: 5 },
      { required: true },
    ].forEach((prop) =>
      describe(JSON.stringify(prop), () => {
        it('TextArea should have attribute defined', () => {
          const key = Object.keys(prop)[0];
          const value = prop[key];
          expect(
            shallow(
              <FieldTextAreaStateless onChange={() => {}} label="" {...prop} />,
            )
              .find(TextArea)
              .prop(key),
          ).toBe(value);
        });
      }),
    );

    it('TextArea should have value="something"', () =>
      expect(
        shallow(
          <FieldTextAreaStateless
            onChange={() => {}}
            value="something"
            label=""
          />,
        )
          .find(TextArea)
          .prop('value'),
      ).toBe('something'));

    it('onChange should be called when input value changes', () => {
      const spy = jest.fn();
      const wrapper = mount(<FieldTextAreaStateless onChange={spy} label="" />);
      wrapper.find(TextArea).simulate('change');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('FieldTextArea', () => {
    it('should call onChange when input value changes', () => {
      const spy = jest.fn();
      const wrapper = mount(<FieldTextArea onChange={spy} label="" />);
      wrapper.find(TextArea).simulate('change');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('FieldTextArea input focus', () => {
    it('should get focus when focus() is called', () => {
      let hasFocus = 0;
      const wrapper = mount(<FieldTextArea onChange={() => {}} label="" />);
      wrapper.getDOMNode().addEventListener(
        'focus',
        () => {
          hasFocus = 1;
        },
        true,
      );
      wrapper.instance().focus();

      expect(hasFocus).toBe(1);
    });
  });
});

describe('FieldTextAreaStatelessWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<FieldTextAreaStatelessWithAnalytics onChange={() => {}} label="" />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
