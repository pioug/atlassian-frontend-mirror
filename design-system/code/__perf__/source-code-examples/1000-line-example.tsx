// eslint-disable-file
export const thousandLineExample = `// Adapted excerpt of https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/__tests__/Select.test.tsx
import React, { KeyboardEvent } from 'react';
import { render, fireEvent, EventType } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cases from 'jest-in-case';

import {
  OPTIONS,
  OPTIONS_ACCENTED,
  OPTIONS_NUMBER_VALUE,
  OPTIONS_BOOLEAN_VALUE,
  OPTIONS_DISABLED,
  Option,
  OptionNumberValue,
  OptionBooleanValue,
} from './constants';
import Select, { FormatOptionLabelMeta } from '../Select';
import { FilterOptionOption } from '../filters';

import { matchers } from '@emotion/jest';
import { AriaLiveMessages } from '../accessibility';
import { noop } from '../utils';
import { GroupBase } from '../types';

expect.extend(matchers);

interface BasicProps {
  readonly className: string;
  readonly classNamePrefix: string;
  readonly onChange: () => void;
  readonly onInputChange: () => void;
  readonly onMenuClose: () => void;
  readonly onMenuOpen: () => void;
  readonly name: string;
  readonly options: readonly Option[];
  readonly inputValue: string;
  readonly value: null;
}

const BASIC_PROPS: BasicProps = {
  className: 'react-select',
  classNamePrefix: 'react-select',
  onChange: jest.fn(),
  onInputChange: jest.fn(),
  onMenuClose: jest.fn(),
  onMenuOpen: jest.fn(),
  name: 'test-input-name',
  options: OPTIONS,
  inputValue: '',
  value: null,
};

test('snapshot - defaults', () => {
  const { container } = render(
    <Select
      onChange={noop}
      onInputChange={noop}
      onMenuOpen={noop}
      onMenuClose={noop}
      inputValue=""
      value={null}
    />
  );
  expect(container).toMatchSnapshot();
});

test('instanceId prop > to have instanceId as id prefix for the select components', () => {
  let { container } = render(
    <Select {...BASIC_PROPS} menuIsOpen instanceId={'custom-id'} />
  );
  expect(container.querySelector('input')!.id).toContain('custom-id');
  container.querySelectorAll('div.react-select__option').forEach((opt) => {
    expect(opt.id).toContain('custom-id');
  });
});

test('hidden input field is not present if name is not passes', () => {
  let { container } = render(
    <Select
      onChange={noop}
      onInputChange={noop}
      onMenuOpen={noop}
      onMenuClose={noop}
      inputValue=""
      value={null}
      options={OPTIONS}
    />
  );
  expect(container.querySelector('input[type="hidden"]')).toBeNull();
});

test('hidden input field is present if name passes', () => {
  let { container } = render(
    <Select
      onChange={noop}
      onInputChange={noop}
      onMenuOpen={noop}
      onMenuClose={noop}
      inputValue=""
      value={null}
      name="test-input-name"
      options={OPTIONS}
    />
  );
  expect(container.querySelector('input[type="hidden"]')).toBeTruthy();
});

test('single select > passing multiple values > should select the first value', () => {
  const props = { ...BASIC_PROPS, value: [OPTIONS[0], OPTIONS[4]] };
  let { container } = render(<Select {...props} />);

  expect(container.querySelector('.react-select__control')!.textContent).toBe(
    '0'
  );
});

test('isRtl boolean prop sets direction: rtl on container', () => {
  let { container } = render(
    <Select {...BASIC_PROPS} value={[OPTIONS[0]]} isRtl isClearable />
  );
  expect(container.firstChild).toHaveStyleRule('direction', 'rtl');
});

test('isOptionSelected() prop > single select > mark value as isSelected if isOptionSelected returns true for the option', () => {
  // Select all but option with label '1'
  let isOptionSelected = jest.fn((option) => option.label !== '1');
  let { container } = render(
    <Select {...BASIC_PROPS} isOptionSelected={isOptionSelected} menuIsOpen />
  );
  let options = container.querySelectorAll('.react-select__option');

  // Option label 0 to be selected
  expect(options[0].classList).toContain('react-select__option--is-selected');
  // Option label 1 to be not selected
  expect(options[1].classList).not.toContain(
    'react-select__option--is-selected'
  );
});

test('isOptionSelected() prop > multi select > to not show the selected options in Menu for multiSelect', () => {
  // Select all but option with label '1'
  let isOptionSelected = jest.fn((option) => option.label !== '1');
  let { container } = render(
    <Select
      {...BASIC_PROPS}
      isMulti
      isOptionSelected={isOptionSelected}
      menuIsOpen
    />
  );

  expect(container.querySelectorAll('.react-select__option')).toHaveLength(1);
  expect(container.querySelector('.react-select__option')!.textContent).toBe(
    '1'
  );
});

cases(
  'formatOptionLabel',
  ({ props, valueComponentSelector, expectedOptions }) => {
    let { container } = render(<Select {...props} />);
    let value = container.querySelector(valueComponentSelector);
    expect(value!.textContent).toBe(expectedOptions);
  },
  {
    'single select > should format label of options according to text returned by formatOptionLabel':
      {
        props: {
          ...BASIC_PROPS,
          formatOptionLabel: (
            { label, value }: Option,
            { context }: FormatOptionLabelMeta<Option>
          ) => '{label} {value} {context}',
          value: OPTIONS[0],
        },
        valueComponentSelector: '.react-select__single-value',
        expectedOptions: '0 zero value',
      },
    'multi select > should format label of options according to text returned by formatOptionLabel':
      {
        props: {
          ...BASIC_PROPS,
          formatOptionLabel: (
            { label, value }: Option,
            { context }: FormatOptionLabelMeta<Option>
          ) => '{label} {value} {context}',
          isMulti: true,
          value: OPTIONS[0],
        },
        valueComponentSelector: '.react-select__multi-value',
        expectedOptions: '0 zero value',
      },
  }
);

cases(
  'name prop',
  ({ expectedName, props }) => {
    let { container } = render(<Select {...props} />);
    let input = container.querySelector<HTMLInputElement>('input[type=hidden]');

    expect(input!.name).toBe(expectedName);
  },
  {
    'single select > should assign the given name': {
      props: { ...BASIC_PROPS, name: 'form-field-single-select' },
      expectedName: 'form-field-single-select',
    },
    'multi select > should assign the given name': {
      props: {
        ...BASIC_PROPS,
        name: 'form-field-multi-select',
        isMulti: true,
        value: OPTIONS[2],
      },
      expectedName: 'form-field-multi-select',
    },
  }
);

cases(
  'menuIsOpen prop',
  ({ props = BASIC_PROPS }) => {
    let { container, rerender } = render(<Select {...props} />);
    expect(container.querySelector('.react-select__menu')).toBeFalsy();

    rerender(<Select {...props} menuIsOpen />);
    expect(container.querySelector('.react-select__menu')).toBeTruthy();

    rerender(<Select {...props} />);
    expect(container.querySelector('.react-select__menu')).toBeFalsy();
  },
  {
    'single select > should show menu if menuIsOpen is true and hide menu if menuIsOpen prop is false':
      {},
    'multi select > should show menu if menuIsOpen is true and hide menu if menuIsOpen prop is false':
      {
        props: {
          ...BASIC_PROPS,
          isMulti: true,
        },
      },
  }
);

cases(
  'filterOption() prop - default filter behavior',
  ({ props, searchString, expectResultsLength }) => {
    let { container, rerender } = render(<Select {...props} />);
    rerender(<Select {...props} inputValue={searchString} />);
    expect(container.querySelectorAll('.react-select__option')).toHaveLength(
      expectResultsLength
    );
  },
  {
    'single select > should match accented char': {
      props: {
        ...BASIC_PROPS,
        menuIsOpen: true,
        options: OPTIONS_ACCENTED,
      },
      searchString: 'ecole', // should match "école"
      expectResultsLength: 1,
    },
    'single select > should ignore accented char in query': {
      props: {
        ...BASIC_PROPS,
        menuIsOpen: true,
        options: OPTIONS_ACCENTED,
      },
      searchString: 'schoöl', // should match "school"
      expectResultsLength: 1,
    },
  }
);

cases(
  'filterOption() prop - should filter only if function returns truthy for value',
  ({ props, searchString, expectResultsLength }) => {
    let { container, rerender } = render(<Select {...props} />);
    rerender(<Select {...props} inputValue={searchString} />);
    expect(container.querySelectorAll('.react-select__option')).toHaveLength(
      expectResultsLength
    );
  },
  {
    'single select > should filter all options as per searchString': {
      props: {
        ...BASIC_PROPS,
        filterOption: (value: FilterOptionOption<Option>, search: string) =>
          value.value.indexOf(search) > -1,
        menuIsOpen: true,
        value: OPTIONS[0],
      },
      searchString: 'o',
      expectResultsLength: 5,
    },
    'multi select > should filter all options other that options in value of select':
      {
        props: {
          ...BASIC_PROPS,
          filterOption: (value: FilterOptionOption<Option>, search: string) =>
            value.value.indexOf(search) > -1,
          isMulti: true,
          menuIsOpen: true,
          value: OPTIONS[0],
        },
        searchString: 'o',
        expectResultsLength: 4,
      },
  }
);

cases(
  'filterOption prop is null',
  ({ props, searchString, expectResultsLength }) => {
    let { container, rerender } = render(<Select {...props} />);
    rerender(<Select {...props} inputValue={searchString} />);
    expect(container.querySelectorAll('.react-select__option')).toHaveLength(
      expectResultsLength
    );
  },
  {
    'single select > should show all the options': {
      props: {
        ...BASIC_PROPS,
        filterOption: null,
        menuIsOpen: true,
        value: OPTIONS[0],
      },
      searchString: 'o',
      expectResultsLength: 17,
    },
    'multi select > should show all the options other than selected options': {
      props: {
        ...BASIC_PROPS,
        filterOption: null,
        isMulti: true,
        menuIsOpen: true,
        value: OPTIONS[0],
      },
      searchString: 'o',
      expectResultsLength: 16,
    },
  }
);

cases(
  'no option found on search based on filterOption prop',
  ({ props, searchString }) => {
    let { getByText, rerender } = render(<Select {...props} />);
    rerender(<Select {...props} inputValue={searchString} />);
    expect(getByText('No options').className).toContain(
      'menu-notice--no-options'
    );
  },
  {
    'single Select > should show NoOptionsMessage': {
      props: {
        ...BASIC_PROPS,
        filterOption: (value: FilterOptionOption<Option>, search: string) =>
          value.value.indexOf(search) > -1,
        menuIsOpen: true,
      },
      searchString: 'some text not in options',
    },
    'multi select > should show NoOptionsMessage': {
      props: {
        ...BASIC_PROPS,
        filterOption: (value: FilterOptionOption<Option>, search: string) =>
          value.value.indexOf(search) > -1,
        menuIsOpen: true,
      },
      searchString: 'some text not in options',
    },
  }
);

cases(
  'noOptionsMessage() function prop',
  ({ props, expectNoOptionsMessage, searchString }) => {
    let { getByText, rerender } = render(<Select {...props} />);
    rerender(<Select {...props} inputValue={searchString} />);
    expect(getByText(expectNoOptionsMessage).className).toContain(
      'menu-notice--no-options'
    );
  },
  {
    'single Select > should show NoOptionsMessage returned from noOptionsMessage function prop':
      {
        props: {
          ...BASIC_PROPS,
          filterOption: (value: FilterOptionOption<Option>, search: string) =>
            value.value.indexOf(search) > -1,
          menuIsOpen: true,
          noOptionsMessage: () =>
            'this is custom no option message for single select',
        },
        expectNoOptionsMessage:
          'this is custom no option message for single select',
        searchString: 'some text not in options',
      },
    'multi select > should show NoOptionsMessage returned from noOptionsMessage function prop':
      {
        props: {
          ...BASIC_PROPS,
          filterOption: (value: FilterOptionOption<Option>, search: string) =>
            value.value.indexOf(search) > -1,
          menuIsOpen: true,
          noOptionsMessage: () =>
            'this is custom no option message for multi select',
        },
        expectNoOptionsMessage:
          'this is custom no option message for multi select',
        searchString: 'some text not in options',
      },
  }
);

cases(
  'value prop',
  ({ props, expectedValue }) => {
    let value;
    render(
      <Select<Option | OptionNumberValue, boolean>
        {...props}
        components={{
          Control: ({ getValue }) => {
            value = getValue();
            return null;
          },
        }}
      />
    );
    expect(value).toEqual(expectedValue);
  },
  {
    'single select > should set it as initial value': {
      props: {
        ...BASIC_PROPS,
        value: OPTIONS[2],
      },
      expectedValue: [{ label: '2', value: 'two' }],
    },
    'single select > with option values as number > should set it as initial value':
      {
        props: {
          ...BASIC_PROPS,
          value: OPTIONS_NUMBER_VALUE[2],
        },
        expectedValue: [{ label: '2', value: 2 }],
      },
    'multi select > should set it as initial value': {
      props: {
        ...BASIC_PROPS,
        isMulti: true,
        value: OPTIONS[1],
      },
      expectedValue: [{ label: '1', value: 'one' }],
    },
    'multi select > with option values as number > should set it as initial value':
      {
        props: {
          ...BASIC_PROPS,
          isMulti: true,
          value: OPTIONS_NUMBER_VALUE[1],
        },
        expectedValue: [{ label: '1', value: 1 }],
      },
  }
);

cases(
  'update the value prop',
  ({
    props = { ...BASIC_PROPS, value: OPTIONS[1] },
    updateValueTo,
    expectedInitialValue,
    expectedUpdatedValue,
  }) => {
    let { container, rerender } = render(
      <Select<Option | OptionNumberValue, boolean> {...props} />
    );
    expect(
      container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value
    ).toEqual(expectedInitialValue);

    rerender(
      <Select<Option | OptionNumberValue, boolean>
        {...props}
        value={updateValueTo}
      />
    );

    expect(
      container.querySelector<HTMLInputElement>('input[type="hidden"]')!.value
    ).toEqual(expectedUpdatedValue);
  },
  {
    'single select > should update the value when prop is updated': {
      updateValueTo: OPTIONS[3],
      expectedInitialValue: 'one',
      expectedUpdatedValue: 'three',
    },
    'single select > value of options is number > should update the value when prop is updated':
      {
        props: {
          ...BASIC_PROPS,
          options: OPTIONS_NUMBER_VALUE,
          value: OPTIONS_NUMBER_VALUE[2],
        },
        updateValueTo: OPTIONS_NUMBER_VALUE[3],
        expectedInitialValue: '2',
        expectedUpdatedValue: '3',
      },
    'multi select > should update the value when prop is updated': {
      props: {
        ...BASIC_PROPS,
        isMulti: true,
        value: OPTIONS[1],
      },
      updateValueTo: OPTIONS[3],
      expectedInitialValue: 'one',
      expectedUpdatedValue: 'three',
    },
    'multi select > value of options is number > should update the value when prop is updated':
      {
        props: {
          ...BASIC_PROPS,
          delimiter: ',',
          isMulti: true,
          options: OPTIONS_NUMBER_VALUE,
          value: OPTIONS_NUMBER_VALUE[2],
        },
        updateValueTo: [OPTIONS_NUMBER_VALUE[3], OPTIONS_NUMBER_VALUE[2]],
        expectedInitialValue: '2',
        expectedUpdatedValue: '3,2',
      },
  }
);

cases(
  'calls onChange on selecting an option',
  ({
    props = { ...BASIC_PROPS, menuIsOpen: true },
    event: [eventName, eventOptions],
    expectedSelectedOption,
    optionsSelected,
    focusedOption,
    expectedActionMetaOption,
  }) => {
    let onChangeSpy = jest.fn();
    props = { ...props, onChange: onChangeSpy };
    let { container } = render(
      <Select<Option | OptionNumberValue | OptionBooleanValue, boolean>
        {...props}
      />
    );

    if (focusedOption) {
      focusOption(container, focusedOption, props.options);
    }

    let selectOption = [
      ...container.querySelectorAll('div.react-select__option'),
    ].find((n) => n.textContent === optionsSelected.label);

    fireEvent[eventName](selectOption!, eventOptions);
    expect(onChangeSpy).toHaveBeenCalledWith(expectedSelectedOption, {
      action: 'select-option',
      option: expectedActionMetaOption,
      name: BASIC_PROPS.name,
    });
  },
  {
    'single select > option is clicked > should call onChange() prop with selected option':
      {
        event: ['click' as const] as const,
        optionsSelected: { label: '2', value: 'two' },
        expectedSelectedOption: { label: '2', value: 'two' },
      },
    'single select > option with number value > option is clicked > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          menuIsOpen: true,
          options: OPTIONS_NUMBER_VALUE,
        },
        event: ['click' as const] as const,
        optionsSelected: { label: '0', value: 0 },
        expectedSelectedOption: { label: '0', value: 0 },
      },
    'single select > option with boolean value > option is clicked > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          menuIsOpen: true,
          options: OPTIONS_BOOLEAN_VALUE,
        },
        event: ['click' as const] as const,
        optionsSelected: { label: 'true', value: true },
        expectedSelectedOption: { label: 'true', value: true },
      },
    'single select > tab key is pressed while focusing option > should call onChange() prop with selected option':
      {
        event: ['keyDown' as const, { keyCode: 9, key: 'Tab' }] as const,
        optionsSelected: { label: '1', value: 'one' },
        focusedOption: { label: '1', value: 'one' },
        expectedSelectedOption: { label: '1', value: 'one' },
      },
    'single select > enter key is pressed while focusing option > should call onChange() prop with selected option':
      {
        event: ['keyDown' as const, { keyCode: 13, key: 'Enter' }] as const,
        optionsSelected: { label: '3', value: 'three' },
        focusedOption: { label: '3', value: 'three' },
        expectedSelectedOption: { label: '3', value: 'three' },
      },
    'single select > space key is pressed while focusing option > should call onChange() prop with selected option':
      {
        event: ['keyDown' as const, { keyCode: 32, key: ' ' }] as const,
        optionsSelected: { label: '1', value: 'one' },
        focusedOption: { label: '1', value: 'one' },
        expectedSelectedOption: { label: '1', value: 'one' },
      },
    'multi select > option is clicked > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          isMulti: true,
          menuIsOpen: true,
          options: OPTIONS,
        },
        event: ['click' as const] as const,
        optionsSelected: { label: '2', value: 'two' },
        expectedSelectedOption: [{ label: '2', value: 'two' }],
        expectedActionMetaOption: { label: '2', value: 'two' },
      },
    'multi select > option with number value > option is clicked > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          isMulti: true,
          menuIsOpen: true,
          options: OPTIONS_NUMBER_VALUE,
        },
        event: ['click' as const] as const,
        optionsSelected: { label: '0', value: 0 },
        expectedSelectedOption: [{ label: '0', value: 0 }],
        expectedActionMetaOption: { label: '0', value: 0 },
      },
    'multi select > option with boolean value > option is clicked > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          isMulti: true,
          menuIsOpen: true,
          options: OPTIONS_BOOLEAN_VALUE,
        },
        event: ['click' as const] as const,
        optionsSelected: { label: 'true', value: true },
        expectedSelectedOption: [{ label: 'true', value: true }],
        expectedActionMetaOption: { label: 'true', value: true },
      },
    'multi select > tab key is pressed while focusing option > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          isMulti: true,
          menuIsOpen: true,
          options: OPTIONS,
        },
        event: ['keyDown' as const, { keyCode: 9, key: 'Tab' }] as const,
        menuIsOpen: true,
        optionsSelected: { label: '1', value: 'one' },
        focusedOption: { label: '1', value: 'one' },
        expectedSelectedOption: [{ label: '1', value: 'one' }],
        expectedActionMetaOption: { label: '1', value: 'one' },
      },
    'multi select > enter key is pressed while focusing option > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          isMulti: true,
          menuIsOpen: true,
          options: OPTIONS,
        },
        event: ['keyDown' as const, { keyCode: 13, key: 'Enter' }] as const,
        optionsSelected: { label: '3', value: 'three' },
        focusedOption: { label: '3', value: 'three' },
        expectedSelectedOption: [{ label: '3', value: 'three' }],
        expectedActionMetaOption: { label: '3', value: 'three' },
      },
    'multi select > space key is pressed while focusing option > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          isMulti: true,
          menuIsOpen: true,
          options: OPTIONS,
        },
        event: ['keyDown' as const, { keyCode: 32, key: ' ' }] as const,
        optionsSelected: { label: '1', value: 'one' },
        focusedOption: { label: '1', value: 'one' },
        expectedSelectedOption: [{ label: '1', value: 'one' }],
        expectedActionMetaOption: { label: '1', value: 'one' },
      },
  }
);

interface CallsOnChangeOnDeselectOptsProps
  extends Omit<BasicProps, 'options' | 'value'> {
  readonly options: readonly (
    | Option
    | OptionNumberValue
    | OptionBooleanValue
  )[];
  readonly value:
    | readonly Option[]
    | readonly OptionNumberValue[]
    | readonly OptionBooleanValue[]
    | Option;
  readonly menuIsOpen?: boolean;
  readonly hideSelectedOptions?: boolean;
  readonly isMulti?: boolean;
}

interface CallsOnOnDeselectChangeOpts {
  readonly props: CallsOnChangeOnDeselectOptsProps;
  readonly event: readonly [EventType] | readonly [EventType, {}];
  readonly menuIsOpen?: boolean;
  readonly optionsSelected: Option | OptionNumberValue | OptionBooleanValue;
  readonly focusedOption?: Option | OptionNumberValue | OptionBooleanValue;
  readonly expectedSelectedOption:
    | readonly Option[]
    | readonly OptionNumberValue[]
    | readonly OptionBooleanValue[];
  readonly expectedMetaOption: Option | OptionNumberValue | OptionBooleanValue;
}

cases<CallsOnOnDeselectChangeOpts>(
  'calls onChange on de-selecting an option in multi select',
  ({
    props,
    event: [eventName, eventOptions],
    expectedSelectedOption,
    expectedMetaOption,
    optionsSelected,
    focusedOption,
  }) => {
    let onChangeSpy = jest.fn();
    props = {
      ...props,
      onChange: onChangeSpy,
      menuIsOpen: true,
      hideSelectedOptions: false,
      isMulti: true,
    };
    let { container } = render(
      <Select<Option | OptionNumberValue | OptionBooleanValue, boolean>
        {...props}
      />
    );

    let selectOption = [
      ...container.querySelectorAll('div.react-select__option'),
    ].find((n) => n.textContent === optionsSelected.label);
    if (focusedOption) {
      focusOption(container, focusedOption, props.options);
    }
    fireEvent[eventName](selectOption!, eventOptions);
    expect(onChangeSpy).toHaveBeenCalledWith(expectedSelectedOption, {
      action: 'deselect-option',
      option: expectedMetaOption,
      name: BASIC_PROPS.name,
    });
  },
  {
    'option is clicked > should call onChange() prop with correct selected options and meta':
      {
        props: {
          ...BASIC_PROPS,
          options: OPTIONS,
          value: [{ label: '2', value: 'two' }],
        },
        event: ['click'],
        optionsSelected: { label: '2', value: 'two' },
        expectedSelectedOption: [],
        expectedMetaOption: { label: '2', value: 'two' },
      },
    'option with number value > option is clicked > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          options: OPTIONS_NUMBER_VALUE,
          value: [{ label: '0', value: 0 }],
        },
        event: ['click'],
        optionsSelected: { label: '0', value: 0 },
        expectedSelectedOption: [],
        expectedMetaOption: { label: '0', value: 0 },
      },
    'option with boolean value > option is clicked > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          options: OPTIONS_BOOLEAN_VALUE,
          value: [{ label: 'true', value: true }],
        },
        event: ['click'],
        optionsSelected: { label: 'true', value: true },
        expectedSelectedOption: [],
        expectedMetaOption: { label: 'true', value: true },
      },
    'tab key is pressed while focusing option > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          options: OPTIONS,
          value: [{ label: '1', value: 'one' }],
        },
        event: ['keyDown', { keyCode: 9, key: 'Tab' }],
        menuIsOpen: true,
        optionsSelected: { label: '1', value: 'one' },
        focusedOption: { label: '1', value: 'one' },
        expectedSelectedOption: [],
        expectedMetaOption: { label: '1', value: 'one' },
      },
    'enter key is pressed while focusing option > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          options: OPTIONS,
          value: { label: '3', value: 'three' },
        },
        event: ['keyDown', { keyCode: 13, key: 'Enter' }],
        optionsSelected: { label: '3', value: 'three' },
        focusedOption: { label: '3', value: 'three' },
        expectedSelectedOption: [],
        expectedMetaOption: { label: '3', value: 'three' },
      },
    'space key is pressed while focusing option > should call onChange() prop with selected option':
      {
        props: {
          ...BASIC_PROPS,
          options: OPTIONS,
          value: [{ label: '1', value: 'one' }],
        },
        event: ['keyDown', { keyCode: 32, key: ' ' }],
        optionsSelected: { label: '1', value: 'one' },
        focusedOption: { label: '1', value: 'one' },
        expectedSelectedOption: [],
        expectedMetaOption: { label: '1', value: 'one' },
      },
  }
);

function focusOption(
  container: HTMLElement,
  option: Option | OptionNumberValue | OptionBooleanValue,
  options: readonly (Option | OptionNumberValue | OptionBooleanValue)[]
) {
  let indexOfSelectedOption = options.findIndex(
    (o) => o.value === option.value
  );

  for (let i = -1; i < indexOfSelectedOption; i++) {
    fireEvent.keyDown(container.querySelector('.react-select__menu')!, {
      keyCode: 40,
      key: 'ArrowDown',
    });
  }
  expect(
    container.querySelector('.react-select__option--is-focused')!.textContent
  ).toEqual(option.label);
}

cases(
  'hitting escape on select option',
  ({
    props,
    event: [eventName, eventOptions],
    focusedOption,
    optionsSelected,
  }) => {
    let onChangeSpy = jest.fn();
    let { container } = render(
      <Select
        {...props}
        onChange={onChangeSpy}
        onInputChange={jest.fn()}
        onMenuClose={jest.fn()}
      />
    );

    let selectOption = [
      ...container.querySelectorAll('div.react-select__option'),
    ].find((n) => n.textContent === optionsSelected.label);
    focusOption(container, focusedOption, props.options);

    fireEvent[eventName](selectOption!, eventOptions);
    expect(onChangeSpy).not.toHaveBeenCalled();
  },
  {
    'single select > should not call onChange prop': {
      props: {
        ...BASIC_PROPS,
        menuIsOpen: true,
      },
      optionsSelected: { label: '1', value: 'one' },
      focusedOption: { label: '1', value: 'one' },
      event: ['keyDown' as const, { keyCode: 27 }] as const,
    },
    'multi select > should not call onChange prop': {
      props: {
        ...BASIC_PROPS,
        isMulti: true,
        menuIsOpen: true,
      },
      optionsSelected: { label: '1', value: 'one' },
      focusedOption: { label: '1', value: 'one' },
      event: ['keyDown' as const, { keyCode: 27 }] as const,
    },
  }
);

cases(
  'click to open select',
  ({ props = BASIC_PROPS, expectedToFocus }) => {
    let { container, rerender } = render(
      <Select
        {...props}
        onMenuOpen={() => {
          rerender(<Select {...props} menuIsOpen onMenuOpen={noop} />);
        }}
      />
    );

    fireEvent.mouseDown(
      container.querySelector('.react-select__dropdown-indicator')!,
      { button: 0 }
    );
    expect(
      container.querySelector('.react-select__option--is-focused')!.textContent
    ).toEqual(expectedToFocus.label);
  },
  {
    'single select > should focus the first option': {
      expectedToFocus: { label: '0', value: 'zero' },
    },
    'multi select > should focus the first option': {
      props: {
        ...BASIC_PROPS,
        isMulti: true,
      },
      expectedToFocus: { label: '0', value: 'zero' },
    },
  }
);

test('clicking when focused does not open select when openMenuOnClick=false', () => {
  let spy = jest.fn();
  let { container } = render(
    <Select {...BASIC_PROPS} openMenuOnClick={false} onMenuOpen={spy} />
  );

  // this will get updated on input click,
  // though click on input is not bubbling up to control component
  userEvent.click(container.querySelector('input.react-select__input')!);
  expect(spy).not.toHaveBeenCalled();
});
// dummy comment
// another line
cases(
  'focus on options > keyboard interaction with Menu',
  ({ props, selectedOption, nextFocusOption, keyEvent = [] }) => {
    let { container } = render(<Select {...props} />);

    let indexOfSelectedOption = props.options.indexOf(selectedOption);

    for (let i = -1; i < indexOfSelectedOption; i++) {
      fireEvent.keyDown(container.querySelector('.react-select__menu')!, {
        keyCode: 40,
        key: 'ArrowDown',
      });
    }

    expect(
      container.querySelector('.react-select__option--is-focused')!.textContent
    ).toEqual(selectedOption.label);

    for (let event of keyEvent) {
      fireEvent.keyDown(container.querySelector('.react-select__menu')!, event);
    }

    expect(
      container.querySelector('.react-select__option--is-focused')!.textContent
    ).toEqual(nextFocusOption.label);
  },
);`;
