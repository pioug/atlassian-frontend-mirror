import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import * as themeConstants from '@atlaskit/theme/constants';

import Textfield from '../../index';

describe('Textfield', () => {
  const testId = 'test';

  it('should show defaults', () => {
    render(<Textfield testId={testId} />);
    const input = screen.getByTestId(testId);
    expect(input).toBeInTheDocument();
    expect(input).toBeInstanceOf(HTMLInputElement);
  });

  describe('Properties', () => {
    describe('isCompact', () => {
      beforeEach(() => {
        jest.spyOn(themeConstants, 'gridSize').mockImplementation(() => 8);
        jest.spyOn(themeConstants, 'fontSize').mockImplementation(() => 1);
      });
      const compactProps = [
        {
          isCompact: true,
          height: '2.00em',
        },
        {
          isCompact: false,
          height: ' 2.57em',
        },
      ];
      compactProps.forEach((compactProp) => {
        const { isCompact, height } = compactProp;
        it(`when isCompact is set to ${isCompact}`, () => {
          render(<Textfield testId={testId} isCompact={isCompact} />);
          const input = screen.getByTestId(testId);
          expect(input).toHaveStyle(`height: ${height}`);
        });
      });
    });

    describe('Child Elements', () => {
      const beforeTestId = 'beforeElement';
      const afterTestId = 'afterElement';

      it('should render before element', () => {
        render(
          <Textfield
            elemBeforeInput={
              <span data-testid={beforeTestId}>Before Element</span>
            }
          />,
        );
        const before = screen.getByTestId(beforeTestId);
        expect(before).toHaveTextContent('Before Element');
      });
      it('should render after element', () => {
        render(
          <Textfield
            elemAfterInput={
              <span data-testid={afterTestId}>After Element</span>
            }
          />,
        );
        const after = screen.getByTestId(afterTestId);
        expect(after).toHaveTextContent('After Element');
      });
      it('should render before & after element', () => {
        render(
          <Textfield
            elemBeforeInput={
              <span data-testid={beforeTestId}>Before Element</span>
            }
            elemAfterInput={
              <span data-testid={afterTestId}>After Element</span>
            }
          />,
        );

        const before = screen.getByTestId(beforeTestId);
        expect(before).toHaveTextContent('Before Element');
        const after = screen.getByTestId(afterTestId);
        expect(after).toHaveTextContent('After Element');
      });
    });

    describe('isDisabled', () => {
      it('should make input disabled', () => {
        render(<Textfield isDisabled testId={testId} />);
        const input = screen.getByTestId(testId);
        expect(input).toBeDisabled();
      });
    });

    describe('isInvalid', () => {
      it('should give input invalid styling if invalid', () => {
        render(<Textfield isInvalid testId={testId} />);
        const container = screen.getByTestId('test-container');
        const input = screen.getByTestId(testId);
        expect(container).toHaveAttribute('data-invalid', 'true');
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    describe('isReadOnly', () => {
      it('should make input readOnly', () => {
        render(<Textfield isReadOnly testId={testId} />);
        const input = screen.getByTestId(testId);
        expect(input).toHaveAttribute('readonly');
      });
    });

    describe('isRequired', () => {
      it('should make input required', () => {
        render(<Textfield isRequired testId={testId} />);
        const input = screen.getByTestId(testId);
        expect(input).toBeRequired();
      });
    });

    describe('name', () => {
      it('should set input name', () => {
        render(<Textfield isRequired name="testName" testId={testId} />);
        const input = screen.getByTestId(testId);
        expect(input).toHaveAttribute('name', 'testName');
      });
    });

    describe('appearance', () => {
      it('should have a solid border when appearance is not none', () => {
        render(<Textfield testId={testId} />);
        const textFieldContainer = screen.getByTestId('test-container');
        expect(textFieldContainer).toHaveStyle(`border-style: solid`);
      });
      it('should have no border when appearance is none', () => {
        render(<Textfield appearance="none" testId={testId} />);
        const textFieldContainer = screen.getByTestId('test-container');
        expect(textFieldContainer).toHaveStyle(`border-style: none`);
      });
    });

    describe('isMonospaced', () => {
      it('should get codeFont when TextField is monospace', () => {
        const codeFontFamilyMock = jest.spyOn(themeConstants, 'codeFontFamily');
        render(<Textfield isMonospaced testId={testId} />);
        expect(codeFontFamilyMock).toBeCalled();
      });

      it('should get fontFamily when TextField is not monospace', () => {
        const fontFamilyMock = jest.spyOn(themeConstants, 'fontFamily');
        render(<Textfield testId={testId} />);
        expect(fontFamilyMock).toBeCalled();
      });
    });

    describe('width', () => {
      const widthProps = [
        { width: '', maxWidth: '100%' },
        { width: 'xsmall', maxWidth: '80px' },
        { width: 'small', maxWidth: '160px' },
        { width: 'medium', maxWidth: '240px' },
        { width: 'large', maxWidth: '320px' },
        { width: 'xlarge', maxWidth: '480px' },
        { width: '600', maxWidth: '600px' },
      ];
      widthProps.forEach((widthProp) => {
        const { width, maxWidth } = widthProp;
        it(`max-width should be ${maxWidth} when width prop is ${
          !width ? 'not passed' : width
        }`, () => {
          render(<Textfield width={width} testId={testId} />);
          const textFieldContainer = screen.getByTestId('test-container');
          expect(textFieldContainer).toHaveStyle(`max-width: ${maxWidth}`);
        });
      });
    });

    describe('native input props', () => {
      it('should pass through any native input props to the input', () => {
        const nativeProps = {
          type: 'text',
          name: 'test',
          placeholder: 'test placeholder',
          maxLength: 8,
          min: 1,
          max: 8,
          autoComplete: 'on',
          form: 'test-form',
          pattern: '/.+/',
        };
        render(<Textfield {...nativeProps} testId={testId} />);
        const textField = screen.getByTestId(testId);
        expect(textField).toHaveAttribute('type', nativeProps.type);
        expect(textField).toHaveAttribute('name', nativeProps.name);
        expect(textField).toHaveAttribute(
          'placeholder',
          nativeProps.placeholder,
        );
        expect(textField).toHaveAttribute(
          'maxLength',
          nativeProps.maxLength.toString(),
        );
        expect(textField).toHaveAttribute('min', nativeProps.min.toString());
        expect(textField).toHaveAttribute('max', nativeProps.max.toString());
        expect(textField).toHaveAttribute(
          'autocomplete',
          nativeProps.autoComplete,
        );
        expect(textField).toHaveAttribute('pattern', nativeProps.pattern);
      });
    });

    describe('native input events', () => {
      const options = { target: { value: 'foo' } };
      const keyOptions = { key: 'Enter', code: 13, charCode: 13 };
      const nativeEvents = [
        { prop: 'onChange', fireFunc: fireEvent.change, options },
        { prop: 'onBlur', fireFunc: fireEvent.blur },
        { prop: 'onFocus', fireFunc: fireEvent.focus },
        { prop: 'onMouseDown', fireFunc: fireEvent.mouseDown },
        {
          prop: 'onKeyDown',
          fireFunc: fireEvent.keyDown,
          options: keyOptions,
        },
        {
          prop: 'onKeyPress',
          fireFunc: fireEvent.keyPress,
          options: keyOptions,
        },
        { prop: 'onKeyUp', fireFunc: fireEvent.keyUp, options },
      ];
      nativeEvents.forEach((event) => {
        it(`${event.prop}`, () => {
          const eventSpy = jest.fn();
          render(<Textfield testId={testId} {...{ [event.prop]: eventSpy }} />);
          const input = screen.getByTestId(testId) as HTMLInputElement;
          expect(eventSpy).toHaveBeenCalledTimes(0);
          event.fireFunc(input, event.options);
          expect(eventSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('defaultValue', () => {
      it('should pass defaultValue to value on render', () => {
        render(<Textfield testId={testId} defaultValue="test default value" />);
        const input = screen.getByTestId(testId);
        expect(input).toHaveValue('test default value');
      });
    });

    describe('value', () => {
      it('should have value="test value"', () => {
        render(
          <Textfield testId={testId} onChange={__noop} value="test value" />,
        );
        const input = screen.getByTestId(testId);
        expect(input).toHaveValue('test value');
      });
    });

    describe('onChange', () => {
      it('should update input value when called', () => {
        const spy = jest.fn();
        render(<Textfield testId={testId} onChange={spy} />);
        const input = screen.getByTestId(testId) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'foo' } });
        expect(input).toHaveValue('foo');
      });
    });
    describe('ref', () => {
      it('textfield ref should be an input', () => {
        let ref;
        render(
          <div>
            <Textfield
              ref={(input: HTMLInputElement | null) => {
                ref = input;
              }}
            />
          </div>,
        );
        expect(ref).toBeInstanceOf(HTMLInputElement);
      });
    });
  });

  describe('data-attributes', () => {
    it('text-field container & input styles should have corresponding data-attributes', () => {
      const testId = 'testOverride';
      render(<Textfield testId={testId} />);
      const container = screen.getByTestId(`${testId}-container`);
      expect(container).toHaveAttribute(
        'data-ds--text-field--container',
        'true',
      );
      const input = screen.getByTestId(testId);
      expect(input).toHaveAttribute('data-ds--text-field--input', 'true');
    });
  });
});
