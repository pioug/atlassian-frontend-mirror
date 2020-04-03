import React from 'react';
import { mount } from 'enzyme';
import TextAreaWithAnalytics, {
  TextAreaWithoutAnalytics as TextArea,
} from '../../components/TextArea';

import { TextAreaWrapper } from '../../styled';

describe('TextArea', () => {
  // Stub window.cancelAnimationFrame, so Popper (used in Layer) doesn't error when accessing it.
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('isReadOnly prop', () => {
    describe('set to true', () => {
      it('should sets its value on the input', () => {
        expect(
          mount(<TextArea onChange={() => {}} isReadOnly />)
            .find('textarea')
            .props().readOnly,
        ).toBe(true);
      });

      it('should reflect its value to the TextAreaWrapper', () => {
        expect(
          mount(<TextArea onChange={() => {}} isReadOnly />)
            .find(TextAreaWrapper)
            .props().isReadOnly,
        ).toBe(true);
      });
    });

    describe('set to false', () => {
      it('should sets its value on the input', () => {
        expect(
          mount(<TextArea onChange={() => {}} />)
            .find('textarea')
            .props().readOnly,
        ).toBe(false);
      });

      it('should reflect its value to the TextAreaWrapper', () => {
        expect(
          mount(<TextArea onChange={() => {}} />)
            .find(TextAreaWrapper)
            .props().isReadOnly,
        ).toBe(false);
      });
    });
  });

  describe('required prop', () => {
    it('should sets its value on the input', () => {
      expect(
        mount(<TextArea onChange={() => {}} isRequired />)
          .find('textarea')
          .props().required,
      ).toBe(true);
    });
  });

  describe('isInvalid prop', () => {
    it('should reflect its value to the TextAreaWrapper', () => {
      expect(
        mount(<TextArea onChange={() => {}} isInvalid />)
          .find(TextAreaWrapper)
          .props().isInvalid,
      ).toBe(true);
    });
  });

  describe('spellCheck prop', () => {
    it('should render an input with a spellCheck prop', () => {
      expect(
        mount(<TextArea onChange={() => {}} spellCheck />)
          .find('textarea')
          .props().spellCheck,
      ).toBe(true);
    });
  });

  describe('isMonospaced prop', () => {
    it('should render an input with an isMonospaced prop', () => {
      expect(
        mount(<TextArea onChange={() => {}} isMonospaced />)
          .find(TextAreaWrapper)
          .props().isMonospaced,
      ).toBe(true);
    });
  });

  [
    { name: 'test' },
    { placeholder: 'test placeholder' },
    { maxLength: 5 },
  ].forEach((prop: { [s: string]: any }) =>
    describe(JSON.stringify(prop), () => {
      it('TextArea should have attribute defined', () => {
        const key = Object.keys(prop)[0];
        const value = prop[key];
        expect(
          mount(<TextArea onChange={() => {}} {...prop} />)
            .find('textarea')
            .prop(key),
        ).toBe(value);
      });
    }),
  );

  it('TextArea should have value="something"', () =>
    expect(
      mount(<TextArea onChange={() => {}} value="something" />)
        .find('textarea')
        .prop('value'),
    ).toBe('something'));

  it('onChange should be called when input value changes', () => {
    const spy = jest.fn();
    const wrapper = mount(<TextArea onChange={spy} />);
    wrapper.find('textarea').simulate('change');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('TextArea input focus', () => {
  it('should get focus when focus() is called', () => {
    let hasFocus = 0;
    const wrapper = mount(<TextArea onChange={() => {}} />);
    const textInput = (wrapper
      .find('textarea')
      .instance() as any) as HTMLTextAreaElement;
    textInput.addEventListener(
      'focus',
      () => {
        hasFocus = 1;
      },
      true,
    );
    textInput.focus();

    expect(hasFocus).toBe(1);
  });
});

describe('props', () => {
  it('should pass all the extra props passed down to hidden input', () => {
    const wrapper = mount(<TextArea data-foo="text-area-bar" />);
    expect(wrapper.find('textarea').prop('data-foo')).toBe('text-area-bar');
  });

  it('should use forwardedRef prop when resize is smart', () => {
    const spy = jest.fn();
    mount(<TextArea resize="smart" forwardedRef={spy} />);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should use forwardedRef prop when resize is not smart', () => {
    const spy = jest.fn();
    mount(<TextArea resize="vertical" forwardedRef={spy} />);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('TextAreaWithAnalytics', () => {
  beforeEach(() => {
    // @ts-ignore
    jest.spyOn(global.console, 'warn');
    // @ts-ignore
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    // @ts-ignore
    (global.console.warn as jest.Mock).mockRestore();
    // @ts-ignore
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should mount without errors', () => {
    mount(<TextAreaWithAnalytics onChange={() => {}} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
