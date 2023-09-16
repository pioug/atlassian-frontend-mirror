import React from 'react';

import { render, screen } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import Drawer from '../../index';

describe('Drawer container must have role="dialog" and aria-modal="true" when being opened', () => {
  ffTest(
    'platform.design-system-team.drawer-screen-reader-focus-trap-refactor_hfuxc',
    () => {
      render(
        <Drawer isOpen width="wide" testId="drawer">
          <code>Drawer contents</code>
        </Drawer>,
      );
      const drawerContainer = screen.getByTestId('drawer');
      expect(drawerContainer).toHaveAttribute('role', 'dialog');
      expect(drawerContainer).toHaveAttribute('aria-modal', 'true');
    },
    () => {
      render(
        <Drawer isOpen width="wide" testId="drawer">
          <code>Drawer contents</code>
        </Drawer>,
      );

      const drawerContainer = screen.getByTestId('drawer');
      expect(drawerContainer).not.toHaveAttribute('role', 'dialog');
      expect(drawerContainer).not.toHaveAttribute('aria-modal', 'true');
    },
  );
});
