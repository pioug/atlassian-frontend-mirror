import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../../banner';

expect.extend(toHaveNoViolations);

describe('a11y', () => {
  it('Default banner with icon should not fail an aXe audit', async () => {
    const { container } = render(
      <Banner
        icon={<WarningIcon label="" secondaryColor="inherit" size="medium" />}
      >
        Your license is about to expire.
      </Banner>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Warning banner should not fail an aXe audit', async () => {
    const { container } = render(
      <Banner appearance="warning">Simple warning banner</Banner>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Announcement banner should not fail an aXe audit', async () => {
    const { container } = render(
      <Banner appearance="announcement">Simple announcement banner</Banner>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Error banner should not fail an aXe audit', async () => {
    const { container } = render(
      <Banner appearance="error">Simple error banner</Banner>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have role=alert by default', () => {
    const { getByRole } = render(<Banner />);
    expect(getByRole('alert')).toBeInTheDocument();
  });
});
