import React, { ComponentProps } from 'react';

import { render } from '@testing-library/react';
import {
  axe,
  type JestAxeConfigureOptions,
  toHaveNoViolations,
} from 'jest-axe';

import Radio from '../../radio';
import RadioGroup from '../../radio-group';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

type OptionProps = ComponentProps<typeof Radio>;

const fakeName = 'axe-test-radio-name';
const fakeLabel = 'Axe test radio label';
const fakeValue = 'axe test radio value';

describe('Radio', () => {
  const defaultProps: OptionProps = {
    name: fakeName,
    label: fakeLabel,
    value: fakeValue,
  };

  it('passes basic aXe audit on the initial rendered state', async () => {
    const wrapper = render(<Radio {...defaultProps} />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('passes basic aXe audit on the checked state', async () => {
    const wrapper = render(<Radio {...defaultProps} isChecked />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('passes basic aXe audit on the disabled state', async () => {
    const wrapper = render(<Radio {...defaultProps} isDisabled />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('passes basic aXe audit on the invalid state', async () => {
    const wrapper = render(<Radio {...defaultProps} isInvalid />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('passes basic aXe audit on the required state', async () => {
    const wrapper = render(<Radio {...defaultProps} isRequired />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('passes basic aXe audit on the required state', async () => {
    const wrapper = render(<Radio {...defaultProps} isRequired />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });
});

type RadioGroupProps = ComponentProps<typeof RadioGroup>;
type Option = RadioGroupProps['options'][0];

const fakeOption: Option = {
  label: fakeLabel,
  name: fakeName,
  value: fakeValue,
};

const fakeOptionTwo: Option = {
  label: fakeLabel + '-two',
  name: fakeName + '-two',
  value: fakeValue + '-two',
};

const fakeDisabledOption: Option = {
  label: fakeLabel + '-disabled',
  name: fakeName + '-disabled',
  value: fakeValue + '-disabled',
  isDisabled: true,
};

describe('RadioGroup', () => {
  const defaultProps: RadioGroupProps = {
    options: [fakeOption, fakeOptionTwo, fakeDisabledOption],
  };

  it('passes basic aXe audit on the initial rendered state', async () => {
    const wrapper = render(<RadioGroup {...defaultProps} />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('passes basic aXe audit on the disabled state', async () => {
    const wrapper = render(<RadioGroup {...defaultProps} isDisabled />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('passes basic aXe audit on the invalid state', async () => {
    const wrapper = render(<RadioGroup {...defaultProps} isInvalid />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('passes basic aXe audit on the required state', async () => {
    const wrapper = render(<RadioGroup {...defaultProps} isRequired />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('passes basic aXe audit on the required state', async () => {
    const wrapper = render(<RadioGroup {...defaultProps} isRequired />);
    const results = await axe(wrapper.container, axeRules);

    expect(results).toHaveNoViolations();
  });
});
