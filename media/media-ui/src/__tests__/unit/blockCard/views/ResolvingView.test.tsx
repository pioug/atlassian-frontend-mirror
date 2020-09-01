import React from 'react';
import { cleanup } from '@testing-library/react';
import { renderWithIntl } from '../../../__utils__/render';
import { BlockCardResolvingView } from '../../../../BlockCard';

describe('Block card views - Resolving', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders view', () => {
    const { getByTestId } = renderWithIntl(
      <BlockCardResolvingView testId="resolving-view" />,
    );
    const frame = getByTestId('resolving-view');
    expect(frame.textContent).toBe('Loading...');
  });
});
