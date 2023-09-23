import React from 'react';

import { render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';

import ButtonItem from '../../../menu-item/button-item';
import MenuGroup from '../../menu-group';

describe('<MenuGroup />', () => {
  describe('`aria-busy`', () => {
    it('should be true if `isLoading`', () => {
      const role = 'menu';
      render(
        <MenuGroup isLoading={true} role={role}>
          <ButtonItem onClick={__noop}>Hello world</ButtonItem>
        </MenuGroup>,
      );
      expect(screen.getByRole(role)).toHaveAttribute('aria-busy', 'true');
    });

    it('should be false if not `isLoading`', () => {
      const role = 'menu';
      render(
        <MenuGroup isLoading={false} role={role}>
          <ButtonItem onClick={__noop}>Hello world</ButtonItem>
        </MenuGroup>,
      );
      expect(screen.getByRole(role)).toHaveAttribute('aria-busy', 'false');
    });
  });
});
