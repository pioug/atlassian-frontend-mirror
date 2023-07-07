import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import RangeControlledExample from '../../../examples/constellation/range-controlled';
import RangeDefaultExample from '../../../examples/constellation/range-default';
import RangeDisabledExample from '../../../examples/constellation/range-disabled';
import RangeUncontrolledExample from '../../../examples/constellation/range-uncontrolled';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Default range should pass aXe audit', async () => {
  const { container } = render(<RangeDefaultExample />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Uncontrolled range should pass aXe audit', async () => {
  const { container } = render(<RangeUncontrolledExample />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Controlled range should pass aXe audit', async () => {
  const { container } = render(<RangeControlledExample />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Disabled range should pass aXe audit', async () => {
  const { container } = render(<RangeDisabledExample />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});
