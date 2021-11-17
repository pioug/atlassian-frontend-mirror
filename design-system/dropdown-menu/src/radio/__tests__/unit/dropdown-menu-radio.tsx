import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from '../../../index';

describe('DropdownMenu with RadioGroup and Radio', () => {
  it('should render defaultSelected item as checked', async () => {
    const { findByText, findAllByRole } = render(
      <DropdownMenu trigger="Choices" testId="lite-mode-ddm">
        <DropdownItemRadioGroup id="cities" title="Some cities">
          <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
          <DropdownItemRadio id="melbourne" defaultSelected>
            Melbourne
          </DropdownItemRadio>
        </DropdownItemRadioGroup>
      </DropdownMenu>,
    );

    const trigger = await findByText('Choices');
    act(() => {
      fireEvent.click(trigger);
    });

    let radios = ((await findAllByRole('menuitemradio')) || []).map((x) =>
      x.getAttribute('aria-checked'),
    );

    expect(radios).toEqual(['false', 'true']);
  });

  it('should be able to select a radio by click', async () => {
    const { findByText, findAllByRole } = render(
      <DropdownMenu trigger="Choices" testId="lite-mode-ddm">
        <DropdownItemRadioGroup id="cities" title="Some cities">
          <DropdownItemRadio id="sydney">Sydney</DropdownItemRadio>
          <DropdownItemRadio id="melbourne" defaultSelected>
            Melbourne
          </DropdownItemRadio>
        </DropdownItemRadioGroup>
      </DropdownMenu>,
    );

    const trigger = await findByText('Choices');
    act(() => {
      fireEvent.click(trigger);
    });

    let radios = ((await findAllByRole('menuitemradio')) || []).map((x) =>
      x.getAttribute('aria-checked'),
    );

    expect(radios).toEqual(['false', 'true']);

    const sydney = await findByText('Sydney');
    act(() => {
      fireEvent.click(sydney);
    });

    radios = ((await findAllByRole('menuitemradio')) || []).map((x) =>
      x.getAttribute('aria-checked'),
    );

    expect(radios).toEqual(['true', 'false']);
  });
});
