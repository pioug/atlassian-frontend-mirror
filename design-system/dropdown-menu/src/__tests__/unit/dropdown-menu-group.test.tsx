import React from 'react';

import { render } from '@testing-library/react';

import { DropdownItem, DropdownItemGroup } from '../../index';

describe('DropdownMenu Item Group', () => {
  describe('item group', () => {
    it('should have a group of items with a meaningful title', () => {
      const { getByText } = render(
        <DropdownItemGroup title="Edit page">
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Move</DropdownItem>
        </DropdownItemGroup>,
      );
      expect(getByText('Edit page')).toBeInTheDocument();
      expect(getByText('Edit')).toBeInTheDocument();
      expect(getByText('Move')).toBeInTheDocument();
    });
  });
});
