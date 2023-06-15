import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import Checkbox from '../../checkbox';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

describe('Checkbox Accessibility jest-axe', () => {
  const props = {
    value: 'Basic checkbox',
    label: 'Basic checkbox',
    name: 'checkbox-basic',
    testId: 'the-checkbox',
  };

  it('Checkbox should not fail an aXe audit', async () => {
    const { container } = render(<Checkbox {...props} />);
    const results = await axe(container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('Checked Checkbox should not fail an aXe audit', async () => {
    const { container } = render(<Checkbox {...props} isChecked />);
    const results = await axe(container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('Disabled Checkbox should not fail an aXe audit', async () => {
    const { container } = render(<Checkbox {...props} isDisabled />);
    const results = await axe(container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('Invalid Checkbox should not fail an aXe audit', async () => {
    const { container } = render(<Checkbox {...props} isInvalid />);
    const results = await axe(container, axeRules);

    expect(results).toHaveNoViolations();
  });

  it('Sized Checkbox should not fail an aXe audit', async () => {
    const { container } = render(<Checkbox {...props} size="large" />);
    const results = await axe(container, axeRules);

    expect(results).toHaveNoViolations();
  });
});
