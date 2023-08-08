import React from 'react';

import { render } from '@testing-library/react';
import cases from 'jest-in-case';

import { ButtonItem } from '@atlaskit/menu';

import isCheckboxItem from '../is-checkbox-item';

describe('#isCheckboxItem', () => {
  cases(
    'should return true for checkboxitems with in browsers with voiceover support',
    async ({ role, text }: { role: string; text: string }) => {
      const { getByRole } = render(
        <ButtonItem role={role} aria-checked={true}>
          {text}
        </ButtonItem>,
      );
      expect(isCheckboxItem(getByRole(role))).toBe(true);
    },
    [
      {
        name: 'Button with role checkbox',
        role: 'checkbox',
        text: 'fake checkbox',
      },
      {
        name: 'Button with role menuitemcheckbox',
        role: 'menuitemcheckbox',
        text: 'fake menuitemcheckbox',
      },
    ],
  );

  it('should return false for non-checkboxitems with in browsers with voiceover support', () => {
    const text = 'button';
    const { getByRole } = render(<ButtonItem>{text}</ButtonItem>);

    expect(isCheckboxItem(getByRole('button'))).toBe(false);
  });
});
