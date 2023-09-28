import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import TextArea from '../../text-area';

describe('TextArea', () => {
  describe('TextArea props', () => {
    describe('isDisabled prop', () => {
      it('should sets textarea as disabled', () => {
        const { getByTestId } = render(<TextArea isDisabled testId="test" />);
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea).toBeDisabled();
      });

      it('should not set textarea as disabled', () => {
        const { getByTestId } = render(<TextArea testId="test" />);
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea).toBeEnabled();
      });
    });

    describe('isReadOnly prop', () => {
      it('should sets textarea as readonly', () => {
        const { getByTestId } = render(<TextArea isReadOnly testId="test" />);
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea.readOnly).toBe(true);
      });

      it('should not set textarea as readonly', () => {
        const { getByTestId } = render(<TextArea testId="test" />);
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea.readOnly).toBe(false);
      });
    });

    describe('isRequired prop', () => {
      it('should set textarea as required', () => {
        const { getByTestId } = render(<TextArea testId="test" isRequired />);
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea).toBeRequired();
      });
      it('should not set textarea as required', () => {
        const { getByTestId } = render(<TextArea testId="test" />);
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea).not.toBeRequired();
      });
    });

    describe('value prop', () => {
      it('should set textarea value', () => {
        const { getByTestId } = render(
          <TextArea testId="test" value="testValue" />,
        );
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea.value).toBe('testValue');
      });
    });

    describe('defaultValue prop', () => {
      it('should set textarea defaultValue', () => {
        const { getByTestId } = render(
          <TextArea testId="test" defaultValue="testDefaultValue" />,
        );
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea.defaultValue).toBe('testDefaultValue');
      });
    });

    describe('spellCheck prop', () => {
      it('should enable textarea spellcheck', () => {
        const { getByTestId } = render(<TextArea testId="test" spellCheck />);
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea).toHaveAttribute('spellcheck', 'true');
      });

      it('should not enable textarea spellcheck', () => {
        const { getByTestId } = render(
          <TextArea testId="test" spellCheck={false} />,
        );
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea).toHaveAttribute('spellcheck', 'false');
      });
    });

    describe('placeholder prop', () => {
      it('textarea have passed text in placeholder attribute', () => {
        const { getByTestId } = render(
          <TextArea testId="test" placeholder="test placeholder" />,
        );
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea).toHaveAttribute('placeholder', 'test placeholder');
      });
    });

    describe('name prop', () => {
      it('textarea have passed text in name attribute', () => {
        const { getByTestId } = render(
          <TextArea testId="test" name="test name" />,
        );
        const textarea = getByTestId('test') as HTMLTextAreaElement;
        expect(textarea).toHaveAttribute('name', 'test name');
      });
    });
  });

  describe('TextArea input change', () => {
    it('onChange should be called when input value changes', () => {
      const spy = jest.fn();
      const { getByTestId } = render(
        <TextArea testId="test" name="test name" onChange={spy} />,
      );
      const textarea = getByTestId('test') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'foo' } });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('onChange should be called when input value changes for resize vertical textarea', () => {
      const spy = jest.fn();
      const { getByTestId } = render(
        <TextArea
          testId="test"
          name="test name"
          onChange={spy}
          resize="vertical"
        />,
      );
      const textarea = getByTestId('test') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'foo' } });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('TextArea input focus', () => {
    it('onFocus should be called when input gets focus', () => {
      const spy = jest.fn();
      const { getByTestId } = render(
        <TextArea testId="test" name="test name" onFocus={spy} />,
      );
      const textarea = getByTestId('test') as HTMLTextAreaElement;
      fireEvent.focus(textarea);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('TextArea input blur', () => {
    it('onBlur should be called when input gets blur', () => {
      const spy = jest.fn();
      const { getByTestId } = render(
        <TextArea testId="test" name="test name" onBlur={spy} />,
      );
      const textarea = getByTestId('test') as HTMLTextAreaElement;
      fireEvent.blur(textarea);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('props', () => {
    it('should pass all the extra props passed down to hidden input', () => {
      const { getByTestId } = render(
        <TextArea testId="test" data-foo="text-area-bar" />,
      );
      const textarea = getByTestId('test') as HTMLTextAreaElement;
      expect(textarea).toHaveAttribute('data-foo', 'text-area-bar');
    });

    it('should use ref prop when resize is smart', () => {
      const spy = jest.fn();
      render(<TextArea resize="smart" ref={spy} />);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should use ref prop when resize is not smart', () => {
      const spy = jest.fn();
      render(<TextArea resize="vertical" ref={spy} />);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
