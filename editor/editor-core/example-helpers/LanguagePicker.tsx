import React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import Button from '@atlaskit/button/standard-button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import WorldIcon from '@atlaskit/icon/glyph/world';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

const DropdownContainer = styled.div`
  margin-right: ${gridSize()}px;
  min-width: 200px;
`;

export interface Props {
  locale: string;
  languages: { [key: string]: string };
  onChange: (locale: string) => void;
}

export default class LanguagePicker extends Component<Props> {
  render() {
    const { languages, locale } = this.props;
    return (
      <DropdownContainer>
        <DropdownMenu
          trigger={({ triggerRef, ...providedProps }) => (
            <Button
              {...providedProps}
              ref={triggerRef}
              iconBefore={<WorldIcon label="Language Picker" />}
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
      </DropdownContainer>
    );
  }

  private handleClick = (locale: string) => {
    this.props.onChange(locale);
  };
}
