import React from 'react';

import { render } from '@testing-library/react';

import isRadioItem from '../is-radio-item';

describe('#isCheckboxItem', () => {
  it('should return true for radioitems with in browsers with voiceover support', () => {
    const { getByText } = render(
      <button type="button" role="radio" aria-checked>
        fake radio
      </button>,
    );

    expect(isRadioItem(getByText('fake radio'))).toBe(true);
  });

  it('should return true for radioitems with in browsers with voiceover support', () => {
    const { getByText } = render(
      <button type="button" role="menuitemradio" aria-checked>
        fake radio
      </button>,
    );

    expect(isRadioItem(getByText('fake radio'))).toBe(true);
  });

  it('should return false for non-radioitems with in browsers with voiceover support', () => {
    const { getByText } = render(
      <button type="button" role="menuitemcheckbox" aria-checked>
        fake radio
      </button>,
    );

    expect(isRadioItem(getByText('fake radio'))).toBe(false);
  });
});
