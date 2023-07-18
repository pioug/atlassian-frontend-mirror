import React from 'react';

import { cleanup, render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import PopupExample from '../../../examples/10-popup';

// As we're testing on the JSDOM, color-contrast testing can't run.
// The types of results fetched are limited for performance reasons
it('popup should not fail an aXe audit', async () => {
  const { container } = render(<PopupExample />);
  const results = await axe(container);

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});
