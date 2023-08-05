import React from 'react';

import { render } from '@testing-library/react';

import EmptyState from '../empty-state';

describe('EmptyState', () => {
  it('should render as expected with no props', () => {
    const { getAllByRole } = render(<EmptyState />);

    expect(getAllByRole('columnheader').length).toEqual(9);
  });

  it('should render fewer columns in compact mode', () => {
    const { getAllByRole } = render(<EmptyState isCompact />);

    expect(getAllByRole('columnheader').length).toEqual(6);
  });

  it('should not shimmer when not loading', () => {
    const { getAllByTestId } = render(<EmptyState />);

    getAllByTestId('empty-state-skeleton').forEach(skeleton =>
      expect(skeleton).toHaveStyle('background-size: 0px'),
    );
  });
});
