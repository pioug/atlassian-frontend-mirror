import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import exampleImage from '../../../examples/img/example-image.png';
import EmptyState from '../../empty-state';
import Description from '../../styled/description';
import EmptyStateHeader from '../../styled/header';
import Image from '../../styled/image';
import SpinnerContainer from '../../styled/spinner-container';

expect.extend(toHaveNoViolations);

const props = {
  maxWidth: 500,
  maxHeight: 500,
  header: 'I am the header',
  description: `Lorem ipsum is a pseudo-Latin text used in web design,
        typography, layout, and printing in place of English to emphasise
        design elements over content. It's also called placeholder (or filler)
        text. It's a convenient tool for mock-ups.`,
  imageUrl: exampleImage,
};

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic EmptyState should not fail aXe audit', async () => {
  const { container } = render(<EmptyState {...props} />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Basic Image should not fail aXe audit', async () => {
  const { container } = render(
    <Image
      maxHeight={props.maxHeight}
      maxWidth={props.maxWidth}
      src={props.imageUrl}
    />,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Basic SpinnerContainer should not fail aXe audit', async () => {
  const { container } = render(<SpinnerContainer />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Basic Header should not fail aXe audit', async () => {
  const { container } = render(
    <EmptyStateHeader>{props.header}</EmptyStateHeader>,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Basic Description should not fail aXe audit', async () => {
  const { container } = render(<Description>{props.description}</Description>);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});
