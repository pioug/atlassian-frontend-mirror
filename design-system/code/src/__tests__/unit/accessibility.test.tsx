import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import BasicCodeBlockExample from '../../../examples/00-basic';
import BasicInlineCodeExample from '../../../examples/01-inline-code-basic';
import CodeBlockHighlightingExample from '../../../examples/14-code-block-highlighting-long-lines';
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

  it('CodeBlock example using highlighting and bidi highlighting should not fail aXe audit', async () => {
    const { container } = render(<BasicCodeBlockExample />);
    const results = await axe(container, axeRules);

    expect(results).toHaveNoViolations();
  });
});

describe('Code Accessibility jest-axe', () => {
  it('Inline Code example should not fail aXe audit', async () => {
    const { container } = render(<BasicInlineCodeExample />);
    const results = await axe(container, axeRules);

    expect(results).toHaveNoViolations();
  });
});

it('CodeBlock highlighting lines example should not fail aXe audit', async () => {
  const { container } = render(<CodeBlockHighlightingExample />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});
