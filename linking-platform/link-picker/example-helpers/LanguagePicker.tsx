/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import WorldIcon from '@atlaskit/icon/glyph/world';
import { token } from '@atlaskit/tokens';

const dropdownContainer = css`
  margin-right: ${token('space.100', '8px')};
  min-width: 200px;
`;

export interface LanguagePickerProps {
  locale: string;
  languages: { [key: string]: string };
  onChange: (locale: string) => void;
}

export function LanguagePicker(props: LanguagePickerProps) {
  const { languages, locale, onChange } = props;

  const handleClick = (locale: string) => {
    onChange(locale);
  };
  return (
    <div css={dropdownContainer}>
      <DropdownMenu
        trigger={({ triggerRef, ...providedProps }) => (
          <Button
            {...providedProps}
            ref={triggerRef}
            iconBefore={<WorldIcon label="" />}
            iconAfter={<ChevronDownIcon label="" />}
            shouldFitContainer
          >
            {languages[locale]}
          </Button>
        )}
      >
        <DropdownItemGroup>
          {Object.keys(languages).map(l => (
            <DropdownItem key={l} onClick={() => handleClick(l)}>
              {languages[l]}
            </DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>
    </div>
  );
}
