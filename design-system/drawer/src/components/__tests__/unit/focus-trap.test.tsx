import React from 'react';

import { render, screen } from '@testing-library/react';

import Drawer from '../../index';

describe('Drawer', () => {
  it('container should have role="dialog" and aria-modal="true" when opened', () => {
    render(
      <Drawer isOpen width="wide" testId="drawer">
        <code>Drawer contents</code>
      </Drawer>,
    );
    const drawerContainer = screen.getByTestId('drawer');
    expect(drawerContainer).toHaveAttribute('role', 'dialog');
    expect(drawerContainer).toHaveAttribute('aria-modal', 'true');
  });
});
