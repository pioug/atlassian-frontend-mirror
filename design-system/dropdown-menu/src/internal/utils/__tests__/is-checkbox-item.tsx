import React from 'react';

import { render } from '@testing-library/react';

import isCheckboxItem from '../is-checkbox-item';

describe('#isCheckboxItem', () => {
  it('should return true for checkboxitems with in browsers with voiceover support', () => {
    const { getByText } = render(
      <button type="button" role="checkbox" aria-checked>
        fake checkbox
      </button>,
    );

    expect(isCheckboxItem(getByText('fake checkbox'))).toBe(true);
  });

  it('should return true for checkboxitems with in browsers with voiceover support', () => {
    const { getByText } = render(
      <button type="button" role="menuitemcheckbox" aria-checked>
        fake checkbox
      </button>,
    );

    expect(isCheckboxItem(getByText('fake checkbox'))).toBe(true);
  });

  it('should return false for non-checkboxitems with in browsers with voiceover support', () => {
    const { getByText } = render(
      <button type="button" role="menuitemradio" aria-checked>
        fake checkbox
      </button>,
    );

    expect(isCheckboxItem(getByText('fake checkbox'))).toBe(false);
  });
});
