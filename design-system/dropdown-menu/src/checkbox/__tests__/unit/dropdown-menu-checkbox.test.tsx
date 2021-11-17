import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '../../../index';

describe('DropdownMenu with checkbox as item', () => {
  describe('checkbox', () => {
    it('render checkbox on the dropdown menu', () => {
      const { getByText } = render(
        <DropdownMenu trigger="Select cities">
          <DropdownItemCheckboxGroup id="cities">
            <DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
            <DropdownItemCheckbox id="melbourne">
              Melbourne
            </DropdownItemCheckbox>
          </DropdownItemCheckboxGroup>
        </DropdownMenu>,
      );

      const trigger = getByText('Select cities');
      fireEvent.click(trigger);

      expect(getByText('Sydney')).toBeInTheDocument();
      expect(getByText('Melbourne')).toBeInTheDocument();
    });

    it('click to check checkbox on the dropdown menu', async () => {
      const { getByText, findAllByRole } = render(
        <DropdownMenu trigger="Select cities">
          <DropdownItemCheckboxGroup id="cities">
            <DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
            <DropdownItemCheckbox id="melbourne">
              Melbourne
            </DropdownItemCheckbox>
          </DropdownItemCheckboxGroup>
        </DropdownMenu>,
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

      const melbourne = getByText('Melbourne');
      act(() => {
        fireEvent.click(melbourne);
      });

      checkboxes = ((await findAllByRole('menuitemcheckbox')) || []).map((x) =>
        x.getAttribute('aria-checked'),
      );
      expect(checkboxes).toEqual(['false', 'true']);
    });

    it('click to check multiple checkboxes on the dropdown menu', async () => {
      const { getByText, findAllByRole } = render(
        <DropdownMenu trigger="Select cities">
          <DropdownItemCheckboxGroup id="cities">
            <DropdownItemCheckbox id="sydney">Sydney</DropdownItemCheckbox>
            <DropdownItemCheckbox id="melbourne">
              Melbourne
            </DropdownItemCheckbox>
          </DropdownItemCheckboxGroup>
        </DropdownMenu>,
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

    it('uncheck checkbox on the dropdown menu', async () => {
      const { getByText, findAllByRole } = render(
        <DropdownMenu trigger="Select cities">
          <DropdownItemCheckboxGroup id="cities">
            <DropdownItemCheckbox id="sydney" defaultSelected>
              Sydney
            </DropdownItemCheckbox>
            <DropdownItemCheckbox id="melbourne">
              Melbourne
            </DropdownItemCheckbox>
          </DropdownItemCheckboxGroup>
        </DropdownMenu>,
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
      expect(checkboxes).toEqual(['true', 'false']);

      const sydney = getByText('Sydney');
      act(() => {
        fireEvent.click(sydney);
      });

      checkboxes = ((await findAllByRole('menuitemcheckbox')) || []).map((x) =>
        x.getAttribute('aria-checked'),
      );
      expect(checkboxes).toEqual(['false', 'false']);
    });

    it('reopen dropdown menu the selection should be persisted', async () => {
      const { getByText, findAllByRole, queryByText } = render(
        <DropdownMenu trigger="Select cities">
          <DropdownItemCheckboxGroup id="cities">
            <DropdownItemCheckbox id="sydney" defaultSelected>
              Sydney
            </DropdownItemCheckbox>
            <DropdownItemCheckbox id="melbourne">
              Melbourne
            </DropdownItemCheckbox>
          </DropdownItemCheckboxGroup>
        </DropdownMenu>,
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
      expect(checkboxes).toEqual(['true', 'false']);

      const sydney = getByText('Sydney');
      act(() => {
        fireEvent.click(sydney);
      });

      checkboxes = ((await findAllByRole('menuitemcheckbox')) || []).map((x) =>
        x.getAttribute('aria-checked'),
      );
      expect(checkboxes).toEqual(['false', 'false']);

      // close the dropdown menu
      act(() => {
        fireEvent.click(trigger);
      });

      expect(queryByText('Sydney')).not.toBeInTheDocument();
      expect(queryByText('Melbourne')).not.toBeInTheDocument();

      // click to reopen the dropdown menu
      act(() => {
        fireEvent.click(trigger);
      });

      checkboxes = ((await findAllByRole('menuitemcheckbox')) || []).map((x) =>
        x.getAttribute('aria-checked'),
      );
      expect(checkboxes).toEqual(['false', 'false']);
    });
  });
});
