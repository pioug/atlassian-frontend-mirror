import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import RangeControlledExample from '../../../examples/constellation/range-controlled';
import RangeDefaultExample from '../../../examples/constellation/range-default';
import RangeDisabledExample from '../../../examples/constellation/range-disabled';
import RangeUncontrolledExample from '../../../examples/constellation/range-uncontrolled';

it('Default range should pass aXe audit', async () => {
  const { container } = render(<RangeDefaultExample />);
  await axe(container);
});

it('Uncontrolled range should pass aXe audit', async () => {
  const { container } = render(<RangeUncontrolledExample />);
  await axe(container);
});

it('Controlled range should pass aXe audit', async () => {
  const { container } = render(<RangeControlledExample />);
  await axe(container);
});

it('Disabled range should pass aXe audit', async () => {
  const { container } = render(<RangeDisabledExample />);
  await axe(container);
});
