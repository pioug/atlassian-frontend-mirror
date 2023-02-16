import React from 'react';

import { render } from '@testing-library/react';

import isRadioItem from '../is-radio-item';

const Button = ({ role, children }: any) => (
  <button type="button" role={role} aria-checked>
    {children}
  </button>
);

describe('#isCheckboxItem', () => {
  it('should return true for radioitems with in browsers with voiceover support', () => {
    const text = 'fake radio';
    const { getByText } = render(<Button role="radio">{text}</Button>);

    expect(isRadioItem(getByText(text))).toBe(true);
  });

  it('should return true for radioitems with in browsers with voiceover support', () => {
    const text = 'fake radio';
    const { getByText } = render(<Button role="menuitemradio">{text}</Button>);

    expect(isRadioItem(getByText(text))).toBe(true);
  });

  it('should return false for non-radioitems with in browsers with voiceover support', () => {
    const text = 'fake radio';
    const { getByText } = render(
      <Button role="menuitemcheckbox">{text}</Button>,
    );

    expect(isRadioItem(getByText(text))).toBe(false);
  });
});
