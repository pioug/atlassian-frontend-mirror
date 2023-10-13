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
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Move')).toBeInTheDocument();
    });
  });
});
