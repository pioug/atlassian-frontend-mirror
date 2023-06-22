import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import { CodeBlock } from '../../index';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};
describe('CodeBlock Accessibility jest-axe', () => {
  const props = {
    showLineNumbers: true,
    highlight: '',
    highlightedStartText: 'Highlight start',
    highlightedEndText: 'Highlight end',
    text: 'text',
    codeBidiWarnings: true,
    codeBidiWarningLabel: 'warning label',
    codeBidiWarningTooltipEnable: true,
    shouldWrapLongLines: false,
  };

  it('CodeBlock should not fail an aXe audit', async () => {
    const { container } = render(<CodeBlock {...props} />);
    const results = await axe(container, axeRules);
    expect(results).toHaveNoViolations();
  });
});
