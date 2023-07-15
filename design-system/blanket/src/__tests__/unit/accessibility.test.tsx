/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render } from '@testing-library/react';
import Lorem from 'react-lorem-component';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import Blanket from '../../blanket';

expect.extend(toHaveNoViolations);

it('Basic Blanket should not fail aXe audit', async () => {
  const { container } = render(
    <Blanket isTinted={true} shouldAllowClickThrough={true} />,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('Basic Blanket with children should not fail aXe audit', async () => {
  const { container } = render(
    <Blanket isTinted={true} shouldAllowClickThrough={true}>
      <Lorem count={20} />
    </Blanket>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
