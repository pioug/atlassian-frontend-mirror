import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import * as themeConstants from '@atlaskit/theme/constants';

import Textfield from '../../index';

describe('Textfield', () => {
  it('should show defaults', () => {
    const input = render(<Textfield testId="test" />).getByTestId('test');
    expect(input).toBeDefined();
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
          const input = render(
            <Textfield testId="test" isCompact={isCompact} />,
          ).getByTestId('test');
          expect(input).toHaveStyle(`height: ${height}`);
        });
      });
    });

    describe('Child Elements', () => {
      it('should render before element', () => {
        const { getByTestId } = render(
          <Textfield
            elemBeforeInput={
              <span data-testid="beforeElement">Before Element</span>
            }
          />,
        );
        const before = getByTestId('beforeElement');
        expect(before).toHaveTextContent('Before Element');
      });
      it('should render after element', () => {
        const { getByTestId } = render(
          <Textfield
            elemAfterInput={
              <span data-testid="afterElement">After Element</span>
            }
          />,
        );
        const after = getByTestId('afterElement');
        expect(after).toHaveTextContent('After Element');
      });
      it('should render before & after element', () => {
        const { getByTestId } = render(
          <Textfield
            elemBeforeInput={
              <span data-testid="beforeElement">Before Element</span>
            }
            elemAfterInput={
              <span data-testid="afterElement">After Element</span>
            }
          />,
        );

        const before = getByTestId('beforeElement');
        expect(before).toHaveTextContent('Before Element');
        const after = getByTestId('afterElement');
        expect(after).toHaveTextContent('After Element');
      });
    });

    describe('isDisabled', () => {
      it('should make input disabled', () => {
        const { getByTestId } = render(<Textfield isDisabled testId="test" />);
        const input = getByTestId('test');
        expect(input).toBeDisabled();
      });
    });

    describe('isInvalid', () => {
      it('should give input invalid styling if invalid', () => {
        const { getByTestId } = render(<Textfield isInvalid testId="test" />);
        const container = getByTestId('test-container');
        const input = getByTestId('test');
        expect(container).toHaveAttribute('data-invalid', 'true');
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    describe('isReadOnly', () => {
      it('should make input readOnly', () => {
        const { getByTestId } = render(<Textfield isReadOnly testId="test" />);
        const input = getByTestId('test');
        expect(input).toHaveAttribute('readonly');
      });
    });

    describe('isRequired', () => {
      it('should make input required', () => {
        const { getByTestId } = render(<Textfield isRequired testId="test" />);
        const input = getByTestId('test');
        expect(input).toBeRequired();
      });
    });

    describe('name', () => {
      it('should set input name', () => {
        const { getByTestId } = render(
          <Textfield isRequired name="testName" testId="test" />,
        );
        const input = getByTestId('test');
        expect(input).toHaveAttribute('name', 'testName');
      });
    });

    describe('appearance', () => {
      it('should have a solid border when appearance is not none', () => {
        const { getByTestId } = render(<Textfield testId="test" />);
        const textFieldContainer = getByTestId('test-container');
        expect(textFieldContainer).toHaveStyle(`border-style: solid`);
      });
      it('should have no border when appearance is none', () => {
        const { getByTestId } = render(
          <Textfield appearance="none" testId="test" />,
        );
        const textFieldContainer = getByTestId('test-container');
        expect(textFieldContainer).toHaveStyle(`border-style: none`);
      });
    });

    describe('isMonospaced', () => {
      it('should get codeFont when TextField is monospace', () => {
        const codeFontFamilyMock = jest.spyOn(themeConstants, 'codeFontFamily');
        render(<Textfield isMonospaced testId="test" />);
        expect(codeFontFamilyMock).toBeCalled();
      });

      it('should get fontFamily when TextField is not monospace', () => {
        const fontFamilyMock = jest.spyOn(themeConstants, 'fontFamily');
        render(<Textfield testId="test" />);
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
          const { getByTestId } = render(
            <Textfield width={width} testId="test" />,
          );
          const textFieldContainer = getByTestId('test-container');
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
        const { getByTestId } = render(
          <Textfield {...nativeProps} testId="test" />,
        );
        const textField = getByTestId('test');
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
          const { getByTestId } = render(
            <Textfield testId="test" {...{ [event.prop]: eventSpy }} />,
          );
          const input = getByTestId('test') as HTMLInputElement;
          expect(eventSpy).toHaveBeenCalledTimes(0);
          event.fireFunc(input, event.options);
          expect(eventSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('defaultValue', () => {
      it('should pass defaultValue to value on render', () => {
        const input = render(
          <Textfield testId="test" defaultValue="test default value" />,
        ).getByTestId('test');
        expect(input).toHaveValue('test default value');
      });
    });

    describe('value', () => {
      it('should have value="test value"', () => {
        const input = render(
          <Textfield testId="test" onChange={__noop} value="test value" />,
        ).getByTestId('test');
        expect(input).toHaveValue('test value');
      });
    });

    describe('onChange', () => {
      it('should update input value when called', () => {
        const spy = jest.fn();
        const { getByTestId } = render(
          <Textfield testId="test" onChange={spy} />,
        );
        const input = getByTestId('test') as HTMLInputElement;
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
      const { getByTestId } = render(<Textfield testId={testId} />);
      const container = getByTestId(`${testId}-container`);
      expect(container).toHaveAttribute(
        'data-ds--text-field--container',
        'true',
      );
      const input = getByTestId(testId);
      expect(input).toHaveAttribute('data-ds--text-field--input', 'true');
    });
  });
});
