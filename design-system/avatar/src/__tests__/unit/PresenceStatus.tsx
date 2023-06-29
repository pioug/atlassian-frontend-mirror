// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import { render } from '@testing-library/react';

import Presence from '../../Presence';
import Status from '../../Status';

describe('Presence', () => {
  const presenceValue = 'online';

  it('should have an image role', () => {
    const { getByRole } = render(<Presence presence={presenceValue} />);

    expect(getByRole('img')).toBeInTheDocument();
  });

  it('should have an aria-label that matches the presence value', () => {
    const { getByRole } = render(<Presence presence={presenceValue} />);

    expect(getByRole('img')).toHaveAttribute('aria-label', presenceValue);
  });
});

describe('Status', () => {
  const statusValue = 'approved';

  it('should have an image role', () => {
    const { getByRole } = render(<Status status={statusValue} />);

    expect(getByRole('img')).toBeInTheDocument();
  });

  it('should have an aria-label that matches the status value', () => {
    const { getByRole } = render(<Status status={statusValue} />);

    expect(getByRole('img')).toHaveAttribute('aria-label', statusValue);
  });
});
