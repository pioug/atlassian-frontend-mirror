/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';
import Lorem from 'react-lorem-component';

import Blanket from '../../blanket';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic Blanket should not fail aXe audit', async () => {
  const { container } = render(
    <Blanket isTinted={true} shouldAllowClickThrough={true} />,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Basic Blanket with children should not fail aXe audit', async () => {
  const { container } = render(
    <Blanket isTinted={true} shouldAllowClickThrough={true}>
      <Lorem count={20} />
    </Blanket>,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});
