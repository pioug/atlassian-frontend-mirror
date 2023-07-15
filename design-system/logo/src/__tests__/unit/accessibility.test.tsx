import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import { AtlassianLogo } from '../../index';

expect.extend(toHaveNoViolations);

describe('Logo basic accessibility unit tests audit with jest-axe', () => {
  it('Logo should not fail an aXe audit', async () => {
    const { container } = render(<AtlassianLogo appearance="brand" />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
