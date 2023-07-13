/* eslint-disable jsx-a11y/role-has-required-aria-props */
/* TODO: Use proper items and aria-attributes for tests (DSP-11469) */

import React from 'react';

import { render } from '@testing-library/react';

import isCheckboxItem from '../is-checkbox-item';

const Button = ({ role, children }: any) => (
  <button type="button" role={role} aria-checked>
    {children}
  </button>
);

describe('#isCheckboxItem', () => {
  it('should return true for checkboxitems with in browsers with voiceover support', () => {
    const text = 'fake checkbox';
    const { getByText } = render(<Button role="checkbox">{text}</Button>);

    expect(isCheckboxItem(getByText(text))).toBe(true);
  });

  it('should return true for checkboxitems with in browsers with voiceover support', () => {
    const text = 'fake checkbox';
    const { getByText } = render(
      <Button role="menuitemcheckbox">{text}</Button>,
    );

    expect(isCheckboxItem(getByText(text))).toBe(true);
  });

  it('should return false for non-checkboxitems with in browsers with voiceover support', () => {
    const text = 'fake checkbox';
    const { getByText } = render(<Button role="menuitemradio">{text}</Button>);

    expect(isCheckboxItem(getByText(text))).toBe(false);
  });
});
