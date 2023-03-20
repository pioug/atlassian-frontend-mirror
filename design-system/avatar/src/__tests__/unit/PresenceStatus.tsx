// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { FC } from 'react';

import { render } from '@testing-library/react';

import Presence from '../../Presence';
import Status from '../../Status';

const CustomComponent: FC = () => <div>Test</div>;

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

  it('should set role to presentation and not define aria-label if a custom component is provided', () => {
    const { getByRole, queryByRole } = render(
      <Presence presence={<CustomComponent />} />,
    );

    expect(queryByRole('img')).toBeNull();
    expect(getByRole('presentation')).not.toHaveAttribute('aria-label');
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

  it('should set role to presentation and not define aria-label if a custom component is provided', () => {
    const { getByRole, queryByRole } = render(
      <Status status={<CustomComponent />} />,
    );

    expect(queryByRole('img')).toBeNull();
    expect(getByRole('presentation')).not.toHaveAttribute('aria-label');
  });
});
