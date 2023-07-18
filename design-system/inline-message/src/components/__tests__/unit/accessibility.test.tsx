import React from 'react';

import { render } from '@testing-library/react';

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
