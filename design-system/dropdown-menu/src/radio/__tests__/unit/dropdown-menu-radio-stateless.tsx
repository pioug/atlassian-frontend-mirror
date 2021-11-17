import React, { useState } from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from '../../../index';

const DropdownMenuWithRadio = () => {
  const [selected, setSelected] = useState('');
  return (
    <DropdownMenu
      trigger="Choices"
      onOpenChange={() => {}}
      testId="lite-mode-ddm"
    >
      <DropdownItemRadioGroup id="oversea-cities" title="Oversea cities">
        <DropdownItemRadio
          id="london"
          isSelected={selected === 'london'}
          onClick={() => setSelected('london')}
        >
          London
        </DropdownItemRadio>
        <DropdownItemRadio
          id="berlin"
          isSelected={selected === 'berlin'}
          onClick={() => setSelected('berlin')}
        >
          Berlin
        </DropdownItemRadio>
      </DropdownItemRadioGroup>
    </DropdownMenu>
  );
};

describe('DropdownMenu with RadioGroup and Radio', () => {
  describe('radio', () => {
    it('should render radio as initially unchecked', async () => {
      const { findByText, findAllByRole } = render(<DropdownMenuWithRadio />);

      const trigger = await findByText('Choices');
      act(() => {
        fireEvent.click(trigger);
      });

      let radios = ((await findAllByRole('menuitemradio')) || []).map((x) =>
        x.getAttribute('aria-checked'),
      );

      expect(radios).toEqual(['false', 'false']);
    });

    it('should toggle the radio when click', async () => {
      const { findByText, findAllByRole } = render(<DropdownMenuWithRadio />);

      const trigger = await findByText('Choices');
      act(() => {
        fireEvent.click(trigger);
      });

      let radios = ((await findAllByRole('menuitemradio')) || []).map((x) =>
        x.getAttribute('aria-checked'),
      );

      expect(radios).toEqual(['false', 'false']);

      const london = await findByText('London');

      act(() => {
        fireEvent.click(london);
      });

      radios = ((await findAllByRole('menuitemradio')) || []).map((x) =>
        x.getAttribute('aria-checked'),
      );

      expect(radios).toEqual(['true', 'false']);
    });
  });
});
