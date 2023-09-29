import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import InlineMessage from '../../inline-message';

it('Basic InlineMessage should not fail aXe audit', async () => {
  const { container } = render(
    <InlineMessage
      title="Inline Message Title Example"
      secondaryText="Secondary Text"
    >
      <p>Primary and secondary text dialog</p>
    </InlineMessage>,
  );
  await axe(container);
});

it('Expanded and collapsed states should be communicated programmatically', async () => {
  render(
    <InlineMessage
      title="Inline Message Title Example"
      secondaryText="Secondary Text"
      testId="inline-message"
    >
      <p>Primary and secondary text dialog</p>
    </InlineMessage>,
  );

  const element = screen.getByTestId('inline-message--button');
  expect(element).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(element);
  expect(element).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(element);
  expect(element).toHaveAttribute('aria-expanded', 'false');
});
