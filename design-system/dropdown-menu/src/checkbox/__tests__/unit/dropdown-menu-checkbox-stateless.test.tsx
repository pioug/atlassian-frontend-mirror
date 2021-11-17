import React, { useState } from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '../../../index';

const DropdownCheckboxStateless = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const selectOption = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((x) => x !== option));
    } else {
      setSelected([...selected, option]);
    }
  };
  return (
    <DropdownMenu
      trigger="Select cities"
      onOpenChange={() => {}}
      testId="lite-mode-ddm"
    >
      <DropdownItemCheckboxGroup id="cities" title="Some cities">
        <DropdownItemCheckbox
          id="sydney"
          isSelected={selected.includes('sydney')}
          onClick={() => {
            selectOption('sydney');
          }}
        >
          Sydney
        </DropdownItemCheckbox>
        <DropdownItemCheckbox
          id="melbourne"
          isSelected={selected.includes('melbourne')}
          onClick={() => {
            selectOption('melbourne');
          }}
        >
          Melbourne
        </DropdownItemCheckbox>
      </DropdownItemCheckboxGroup>
    </DropdownMenu>
  );
};

describe('DropdownMenu with checkbox as item', () => {
  describe('checkbox stateless', () => {
    it('select item by click', async () => {
      const { getByText, findAllByRole } = render(
        <DropdownCheckboxStateless />,
      );

      const trigger = getByText('Select cities');

      act(() => {
        fireEvent.click(trigger);
      });

      expect(getByText('Sydney')).toBeInTheDocument();
      expect(getByText('Melbourne')).toBeInTheDocument();

      let checkboxes = (
        (await findAllByRole('menuitemcheckbox')) || []
      ).map((x) => x.getAttribute('aria-checked'));

      expect(checkboxes).toEqual(['false', 'false']);

      const sydney = getByText('Sydney');
      const melbourne = getByText('Melbourne');

      act(() => {
        fireEvent.click(sydney);
      });

      act(() => {
        fireEvent.click(melbourne);
      });

      checkboxes = ((await findAllByRole('menuitemcheckbox')) || []).map((x) =>
        x.getAttribute('aria-checked'),
      );

      expect(checkboxes).toEqual(['true', 'true']);
    });
  });
});
