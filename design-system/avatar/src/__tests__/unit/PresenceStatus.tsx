// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import { render, screen } from '@testing-library/react';

import Presence from '../../Presence';
import Status from '../../Status';

describe('Presence', () => {
  const presenceValue = 'online';

  it('should have a presentation role', () => {
    render(<Presence presence={presenceValue} />);

    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('should not have a <title> tag that matches the presence value', () => {
    render(<Presence presence={presenceValue} />);

    expect(screen.queryByText(`(${presenceValue})`)).not.toBeInTheDocument();
  });
});

describe('Status', () => {
  const statusValue = 'approved';

  it('should have a presentation role', () => {
    render(<Status status={statusValue} />);

    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('should not have a <title> tag that matches the status value', () => {
    render(<Status status={statusValue} />);

    expect(screen.queryByText(`(${statusValue})`)).not.toBeInTheDocument();
  });
});
