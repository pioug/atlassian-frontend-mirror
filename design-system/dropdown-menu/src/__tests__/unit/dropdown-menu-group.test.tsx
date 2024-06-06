import React from 'react';

import { render, screen } from '@testing-library/react';

import { DropdownItem, DropdownItemGroup } from '../../index';

describe('DropdownMenu Item Group', () => {
  describe('item group', () => {
    it('should have a group of items with a meaningful title', () => {
      render(
        <DropdownItemGroup title="Edit page">
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Move</DropdownItem>
        </DropdownItemGroup>,
      );
      expect(screen.getByText('Edit page')).toBeInTheDocument();
      expect(screen.getByText('Edit page')).toHaveAttribute('role', 'menuitem');
      expect(screen.getByText('Edit page')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Move')).toBeInTheDocument();
    });

    it('should have the aria-labelledby attribute', () => {
      render(
        <DropdownItemGroup title="Edit page" testId="ddm-group">
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Move</DropdownItem>
        </DropdownItemGroup>,
      );

      const el = screen.getByTestId('ddm-group');
      const ariaLabelledByValue = el.getAttribute('aria-labelledby');

      expect(ariaLabelledByValue).toMatch("dropdown-menu-item-group-title");
    });
  });
});
