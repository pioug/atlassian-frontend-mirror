// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import { render, screen } from '@testing-library/react';

import Presence from '../../Presence';
import Status from '../../Status';

describe('Presence', () => {
  const presenceValue = 'online';

  it('should have an image role', () => {
    render(<Presence presence={presenceValue} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should have an aria-label that matches the presence value', () => {
    render(<Presence presence={presenceValue} />);

    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      presenceValue,
    );
  });
});

describe('Status', () => {
  const statusValue = 'approved';

  it('should have an image role', () => {
    render(<Status status={statusValue} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should have an aria-label that matches the status value', () => {
    render(<Status status={statusValue} />);

    expect(screen.getByRole('img')).toHaveAttribute('aria-label', statusValue);
  });
});
