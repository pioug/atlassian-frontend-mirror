import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Calendar from '../../index';

// This should be turned back on once the changes under the feature flag
// 'platform.design-system-team.calendar-keyboard-accessibility_967h1` are
// fully rolled out. All the violations are about the `gridcell` role on the
// dates, and that gets fixed up in the changes under that feature flag.
it.skip('Calendar should pass an aXe audit', async () => {
  const { container } = render(<Calendar />);
  await axe(container);
});
