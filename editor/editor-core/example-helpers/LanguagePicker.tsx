/** @jsx jsx */
import { Component } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import WorldIcon from '@atlaskit/icon/glyph/world';
import { token } from '@atlaskit/tokens';

const dropdownContainer = css({
  marginRight: token('space.100', '8px'),
  minWidth: '200px',
});

export interface Props {
  locale: string;
  languages: { [key: string]: string };
  onChange: (locale: string) => void;
}

export default class LanguagePicker extends Component<Props> {
  render() {
    const { languages, locale } = this.props;
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
            {Object.keys(languages).map((l) => (
              <DropdownItem key={l} onClick={() => this.handleClick(l)}>
                {languages[l]}
              </DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>
      </div>
    );
  }

  private handleClick = (locale: string) => {
    this.props.onChange(locale);
  };
}
