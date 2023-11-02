import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies, no-restricted-imports, import/no-extraneous-dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import FloatingToolbar from '../../../ui/FloatingToolbar';

describe('FloatingToolbar', () => {
  const target = document.createElement('div');

  it('renders nothing if there is no target', () => {
    const { queryByTestId } = renderWithIntl(<FloatingToolbar />);
    expect(queryByTestId('popup-wrapper')).toBeNull();
  });

  it('renders popup', async () => {
    const { findByTestId } = renderWithIntl(
      <FloatingToolbar target={target} />,
    );
    expect(findByTestId('popup-wrapper')).toBeDefined();
  });

  it('renders container', async () => {
    const { findByTestId } = renderWithIntl(
      <FloatingToolbar target={target} />,
    );
    expect(findByTestId('popup-container')).toBeDefined();
  });

  it('passes height to popup', async () => {
    const { findByTestId } = renderWithIntl(
      <FloatingToolbar target={target} fitHeight={30} />,
    );
    const el = await findByTestId('popup-container');
    const { height } = window.getComputedStyle(el);
    expect(height).toBe('30px');
  });
});
