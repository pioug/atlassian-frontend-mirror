import React from 'react';

import styled from '@emotion/styled';

import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import { token } from '@atlaskit/tokens';

import { Locale } from './locales';

const DropdownContainer = styled.div`
  display: flex;
  min-width: 200px;
  margin-bottom: ${token('space.200', '16px')};
`;

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
