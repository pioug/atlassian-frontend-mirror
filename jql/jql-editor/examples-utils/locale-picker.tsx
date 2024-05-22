import React from 'react';

import styled from '@emotion/styled';

import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import { token } from '@atlaskit/tokens';

import { Locale } from './locales';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const DropdownContainer = styled.div({
  display: 'flex',
  minWidth: '200px',
  marginBottom: token('space.200', '16px'),
});

export interface Props {
  currentLocale: string;
  locales: Locale[];
  onChange: (locale: Locale) => void;
}

export const LocalePicker = ({ currentLocale, locales, onChange }: Props) => (
  <DropdownContainer>
    <DropdownMenu trigger={currentLocale} placement="bottom-start">
      <DropdownItemGroup>
        {locales.map(l => (
          <DropdownItem key={l} onClick={() => onChange(l)}>
            {l}
          </DropdownItem>
        ))}
      </DropdownItemGroup>
    </DropdownMenu>
  </DropdownContainer>
);
