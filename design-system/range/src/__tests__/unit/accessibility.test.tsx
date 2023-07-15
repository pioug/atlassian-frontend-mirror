import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import RangeControlledExample from '../../../examples/constellation/range-controlled';
import RangeDefaultExample from '../../../examples/constellation/range-default';
import RangeDisabledExample from '../../../examples/constellation/range-disabled';
import RangeUncontrolledExample from '../../../examples/constellation/range-uncontrolled';

expect.extend(toHaveNoViolations);

it('Default range should pass aXe audit', async () => {
  const { container } = render(<RangeDefaultExample />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('Uncontrolled range should pass aXe audit', async () => {
  const { container } = render(<RangeUncontrolledExample />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('Controlled range should pass aXe audit', async () => {
  const { container } = render(<RangeControlledExample />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('Disabled range should pass aXe audit', async () => {
  const { container } = render(<RangeDisabledExample />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
