/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import RadioGroup from '../../RadioGroup';

const sampleOptions = [
  { name: 'test', value: '1', label: 'one' },
  { name: 'test', value: '2', label: 'two' },
  { name: 'test', value: '3', label: 'three', isDisabled: true },
];

describe('@atlaskit/radio', () => {
  describe('RadioGroup', () => {
    describe('props', () => {
      describe('options prop', () => {
        it('renders a Radio with correct props for each option in the array', () => {
          const { getByLabelText, getByRole } = render(
            <RadioGroup options={sampleOptions} />,
          );
          expect(getByRole('radiogroup').children.length).toBe(
            sampleOptions.length,
          );

          sampleOptions.forEach((option) => {
            const radio = getByLabelText(option.label) as HTMLInputElement;
            expect(radio.name).toBe(option.name);
            expect(radio.value).toBe(option.value);
            expect(radio.disabled).toBe(Boolean(option.isDisabled));
          });
        });
      });
      describe('isDisabled prop', () => {
        it('is reflected to each Radio option', () => {
          const isDisabled = true;
          const { getByLabelText } = render(
            <RadioGroup isDisabled={isDisabled} options={sampleOptions} />,
          );
          sampleOptions.forEach((option) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).disabled,
            ).toBe(isDisabled);
          });
        });
        it('if set, overrides isDisabled values set on each option', () => {
          const isDisabled = true;
          const { getByLabelText } = render(
            <RadioGroup
              isDisabled={isDisabled}
              options={[
                ...sampleOptions,
                {
                  name: 'color',
                  value: 'red',
                  label: 'Red',
                  isDisabled: false,
                },
              ]}
            />,
          );
          sampleOptions.forEach((option) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).disabled,
            ).toBe(isDisabled);
          });
        });
      });
      describe('isRequired prop', () => {
        it('is reflected to each Radio option', () => {
          const isRequired = true;
          const { getByLabelText } = render(
            <RadioGroup isRequired={isRequired} options={sampleOptions} />,
          );
          sampleOptions.forEach((option) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).required,
            ).toBe(isRequired);
          });
        });
      });

      describe('name prop', () => {
        it('is reflected to each Radio option and takes precedence over the name property in options', () => {
          const testName = 'test-name';
          const { getByLabelText } = render(
            <RadioGroup name={testName} options={sampleOptions} />,
          );
          sampleOptions.forEach((option) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).name,
            ).toBe(testName);
          });
        });

        it('name property in options is used if there is no name passed into RadioGroup', () => {
          const { getByLabelText } = render(
            <RadioGroup options={sampleOptions} />,
          );
          sampleOptions.forEach((option) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).name,
            ).toBe(option.name);
          });
        });
      });

      describe('value prop', () => {
        it('sets the corresponding Radio instance isChecked prop to true', () => {
          const { getByLabelText } = render(
            <RadioGroup
              value={sampleOptions[0].value}
              options={sampleOptions}
            />,
          );
          sampleOptions.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 0);
          });
        });
        it('Ignores internal state values, if a value prop is specified', () => {
          const { getByLabelText } = render(
            <RadioGroup
              value={sampleOptions[0].value}
              options={sampleOptions}
            />,
          );

          sampleOptions.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 0);
          });

          const secondRadio = getByLabelText(sampleOptions[1].label);
          fireEvent.click(secondRadio);

          sampleOptions.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 0);
          });
        });
        it('If set to undefined, it will revert to the value set in state', () => {
          const { getByLabelText, rerender } = render(
            <RadioGroup
              value={sampleOptions[0].value}
              options={sampleOptions}
            />,
          );

          sampleOptions.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 0);
          });

          const secondRadio = getByLabelText(sampleOptions[1].label);
          fireEvent.click(secondRadio);

          sampleOptions.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 0);
          });

          rerender(<RadioGroup options={sampleOptions} />);

          sampleOptions.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 1);
          });
        });

        it('does not select an option if not specified', () => {
          const options = [
            { name: 'n', value: '0', label: 'zero' },
            { name: 'n', value: '1', label: 'one' },
            { name: 'n', value: '2', label: 'two' },
          ];
          const { getByLabelText } = render(<RadioGroup options={options} />);
          options.forEach((option) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(false);
          });
        });

        it('can select a value which is disabled', () => {
          const options = [
            { name: 'n', value: '0', label: 'zero' },
            { name: 'n', value: '1', label: 'one' },
            { name: 'n', value: '2', label: 'two', isDisabled: true },
          ];
          const { getByLabelText } = render(
            <RadioGroup options={options} value="2" />,
          );
          options.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 2);
          });
        });
      });

      describe('defaultValue prop', () => {
        it('initially sets the corresponding Radio instance isChecked prop to true', () => {
          const { getByLabelText } = render(
            <RadioGroup
              defaultValue={sampleOptions[0].value}
              options={sampleOptions}
            />,
          );

          sampleOptions.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 0);
          });
        });
        it('overrides the checked Radio instance once a subsequent Radio has been triggered', () => {
          const { getByLabelText } = render(
            <RadioGroup
              defaultValue={sampleOptions[0].value}
              options={sampleOptions}
            />,
          );

          sampleOptions.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 0);
          });

          fireEvent.click(getByLabelText('two'));

          sampleOptions.forEach((option, index) => {
            expect(
              (getByLabelText(option.label) as HTMLInputElement).checked,
            ).toBe(index === 1);
          });
        });
      });

      describe('onChange prop', () => {
        it('is called once  a radio option is changed', () => {
          const spy = jest.fn();
          const { getByLabelText } = render(
            <RadioGroup onChange={spy} options={sampleOptions} />,
          );
          fireEvent.click(getByLabelText('one'));
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('calls onChange with the right value', () => {
          let value = '';
          const { getByLabelText } = render(
            <RadioGroup
              onChange={(e) => {
                value = e.currentTarget.value;
              }}
              options={sampleOptions}
            />,
          );
          fireEvent.click(getByLabelText('one'));
          expect(value).toBe('1');
        });
      });
    });
  });
});
