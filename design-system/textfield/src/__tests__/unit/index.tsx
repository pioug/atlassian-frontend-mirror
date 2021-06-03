import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import {
  DN10,
  DN40,
  DN600,
  DN90,
  N10,
  N40,
  N70,
  N900,
  R400,
} from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import * as themeConstants from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import Textfield from '../../index';

describe('Textfield', () => {
  it('should show defaults', () => {
    const input = render(<Textfield testId="test" />).getByTestId('test');
    expect(input).toBeDefined();
    expect(input).toBeInstanceOf(HTMLInputElement);
  });

  describe('- Properties', () => {
    describe('isCompact', () => {
      beforeEach(() => {
        jest.spyOn(themeConstants, 'gridSize').mockImplementation(() => 8);
        jest.spyOn(themeConstants, 'fontSize').mockImplementation(() => 1);
      });
      const compactProps = [
        { isCompact: true, padding: '4px 6px', height: '2.00em' },
        { isCompact: false, padding: '8px 6px', height: ' 2.57em' },
      ];
      compactProps.forEach((compactProp) => {
        const { isCompact, padding, height } = compactProp;
        it(`when isCompact is set to ${isCompact}`, () => {
          const input = render(
            <Textfield testId="test" isCompact={isCompact} />,
          ).getByTestId('test') as HTMLInputElement;
          expect(input).toHaveStyle(`padding: ${padding}`);
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
        const before = getByTestId('beforeElement') as HTMLInputElement;
        expect(before.innerText).toBe('Before Element');
      });
      it('should render after element', () => {
        const { getByTestId } = render(
          <Textfield
            elemAfterInput={
              <span data-testid="afterElement">After Element</span>
            }
          />,
        );
        const after = getByTestId('afterElement') as HTMLInputElement;
        expect(after.innerText).toBe('After Element');
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

        const before = getByTestId('beforeElement') as HTMLInputElement;
        expect(before.innerText).toBe('Before Element');
        const after = getByTestId('afterElement') as HTMLInputElement;
        expect(after.innerText).toBe('After Element');
      });
    });

    describe('isDisabled', () => {
      it('should make input as disabled', () => {
        const { getByTestId } = render(<Textfield isDisabled testId="test" />);
        const input = getByTestId('test') as HTMLInputElement;
        expect(input.disabled).toBe(true);
      });
      describe('styles', () => {
        const disableStyleProps = [
          {
            mode: 'light',
            values: [
              {
                isDisabled: true,
                color: N70,
                backgroundColor: N10,
                borderColor: N10,
              },
              {
                isDisabled: false,
                color: N900,
                backgroundColor: N10,
                borderColor: N40,
              },
            ],
          },
          {
            mode: 'dark',
            values: [
              {
                isDisabled: true,
                color: DN90,
                backgroundColor: DN10,
                borderColor: DN10,
              },
              {
                isDisabled: false,
                color: DN600,
                backgroundColor: DN10,
                borderColor: DN40,
              },
            ],
          },
        ];

        disableStyleProps.forEach((disableProps) => {
          const { mode, values } = disableProps;
          const themeMode = mode as ThemeModes;
          values.forEach((value) => {
            const { isDisabled, color, backgroundColor, borderColor } = value;
            it(`when isDisabled is set to ${isDisabled} & theme mode is ${mode}`, () => {
              const inputContainer = render(
                <GlobalTheme.Provider
                  value={(t) => ({ ...t(), mode: themeMode })}
                >
                  <Textfield testId="test" isDisabled={isDisabled} />,
                </GlobalTheme.Provider>,
              ).getByTestId('test-container') as HTMLInputElement;
              expect(inputContainer).toHaveStyle(`color: ${color}`);
              expect(inputContainer).toHaveStyle(
                `background-color: ${backgroundColor}`,
              );
              expect(inputContainer).toHaveStyle(
                `border-color: ${borderColor}`,
              );
            });
          });
        });
      });
    });

    describe('isReadOnly', () => {
      it('should make input  readOnly', () => {
        const { getByTestId } = render(<Textfield isReadOnly testId="test" />);
        const input = getByTestId('test') as HTMLInputElement;
        expect(input.readOnly).toBe(true);
      });
    });

    describe('isRequired', () => {
      it('should make input required', () => {
        const { getByTestId } = render(<Textfield isRequired testId="test" />);
        const input = getByTestId('test') as HTMLInputElement;
        expect(input.required).toBe(true);
      });
    });

    describe('name', () => {
      it('should set input name', () => {
        const { getByTestId } = render(
          <Textfield isRequired name="testName" testId="test" />,
        );
        const input = getByTestId('test') as HTMLInputElement;
        expect(input.name).toBe('testName');
      });
    });

    describe('appearance', () => {
      it('When appearance is not none', () => {
        const { getByTestId } = render(<Textfield testId="test" />);
        const textFieldContainer = getByTestId('test-container');
        expect(textFieldContainer).toHaveStyle(`border-style: solid`);
      });
      it('When appearance is not none', () => {
        const { getByTestId } = render(
          <Textfield appearance="none" testId="test" />,
        );
        const textFieldContainer = getByTestId('test-container');
        expect(textFieldContainer).toHaveStyle(`border-style: none`);
      });
    });

    describe('appearance', () => {
      it('When appearance is not none', () => {
        const { getByTestId } = render(
          <Textfield
            testId="test"
            elemBeforeInput={<span data-testid="beforeElement">Before</span>}
            elemAfterInput={<span data-testid="afterElement">After</span>}
          />,
        );
        const beforeElement = getByTestId('beforeElement') as HTMLElement;
        const afterElement = getByTestId('afterElement');
        expect(beforeElement.innerText).toBe('Before');
        expect(afterElement.innerText).toBe('After');
      });
    });

    describe('isInvalid', () => {
      it('should make input invalid', () => {
        const { getByTestId } = render(<Textfield isInvalid testId="test" />);
        const textFieldContainer = getByTestId('test-container');
        expect(textFieldContainer).toHaveStyle(`background-color: ${N10}`);
        expect(textFieldContainer).toHaveStyle(`border-color: ${R400}`);
      });
      it('should make input invalid in ', () => {
        const { getByTestId } = render(
          <GlobalTheme.Provider value={(t) => ({ ...t(), mode: 'dark' })}>
            <Textfield isInvalid testId="test" />
          </GlobalTheme.Provider>,
        );
        const textFieldContainer = getByTestId('test-container');
        expect(textFieldContainer).toHaveStyle(`background-color: ${DN10}`);
        expect(textFieldContainer).toHaveStyle(`border-color: ${R400}`);
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
        const textField = getByTestId('test') as HTMLInputElement;
        expect(textField.type).toEqual(nativeProps.type);
        expect(textField.name).toEqual(nativeProps.name);
        expect(textField.placeholder).toEqual(nativeProps.placeholder);
        expect(textField.maxLength).toEqual(nativeProps.maxLength);
        expect(+textField.min).toEqual(nativeProps.min);
        expect(+textField.max).toEqual(nativeProps.max);
        expect(textField.autocomplete).toEqual(nativeProps.autoComplete);
        expect(textField.pattern).toEqual(nativeProps.pattern);
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
      it('should have defaultValue="test default value"', () => {
        const input = render(
          <Textfield testId="test" defaultValue="test default value" />,
        ).getByTestId('test') as HTMLInputElement;
        expect(input.value).toBe('test default value');
      });
    });

    describe('value', () => {
      it('should have value="test value"', () => {
        const input = render(
          <Textfield testId="test" onChange={() => {}} value="test value" />,
        ).getByTestId('test') as HTMLInputElement;
        expect(input.value).toBe('test value');
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
        expect(input.value).toBe('foo');
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
