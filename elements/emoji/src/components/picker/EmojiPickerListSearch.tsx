/** @jsx jsx */
import React, { PureComponent } from 'react';
import { jsx } from '@emotion/react';
import TextField from '@atlaskit/textfield';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { Styles } from '../../types';
import { messages } from '../i18n';
import { input, pickerSearch, searchIcon } from './styles';

export interface Props {
  style?: Styles;
  query?: string;
  onChange: any;
}

type SelectionDirectionType = 'backward' | 'forward' | 'none' | undefined;

interface InputSelection {
  selectionStart: number;
  selectionEnd: number;
  selectionDirection?: SelectionDirectionType;
}

class EmojiPickerListSearch extends PureComponent<
  Props & WrappedComponentProps
> {
  static defaultProps = {
    style: {},
  };

  private inputRef?: HTMLInputElement | null;
  private inputSelection?: InputSelection;

  private onBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    const activeElement = document.activeElement;
    // Input lost focus to emoji picker container (happens in IE11 when updating search results)
    // See FS-2111
    if (
      activeElement instanceof HTMLElement &&
      activeElement.getAttribute('data-emoji-picker-container')
    ) {
      this.restoreInputFocus();
    }
  };

  private onChange = (e: React.SyntheticEvent) => {
    this.saveInputSelection();
    this.props.onChange(e);
  };

  private saveInputSelection() {
    this.inputSelection = undefined;
    if (this.inputRef) {
      const {
        selectionStart,
        selectionEnd,
        selectionDirection,
      } = this.inputRef;
      if (selectionStart && selectionEnd && selectionDirection) {
        this.inputSelection = {
          selectionStart,
          selectionEnd,
          selectionDirection: selectionDirection as SelectionDirectionType,
        };
      }
    }
  }

  private restoreInputFocus() {
    this.focusInput();
    if (
      this.inputSelection &&
      this.inputRef &&
      this.inputRef.setSelectionRange
    ) {
      const {
        selectionStart,
        selectionEnd,
        selectionDirection,
      } = this.inputSelection;
      this.inputRef.setSelectionRange(
        selectionStart,
        selectionEnd,
        selectionDirection,
      );
    }
  }

  private focusInput = () => {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  };

  private handleInputRef = (input: HTMLInputElement | null) => {
    if (input) {
      // Defer focus so it give some time to position the popup before
      // setting the focus to search input.
      // see FS-2056
      this.inputRef = input;
      if (typeof window === 'undefined') {
        return;
      }
      window.setTimeout(this.focusInput);
    }
  };

  render() {
    const { style, query, intl } = this.props;
    const { formatMessage } = intl;

    return (
      <div css={pickerSearch} style={style}>
        <TextField
          aria-label={formatMessage(messages.searchLabel)}
          css={input}
          autoComplete="off"
          name="search"
          placeholder={`${formatMessage(messages.searchPlaceholder)}...`}
          onChange={this.onChange}
          value={query || ''}
          ref={this.handleInputRef}
          isCompact
          onBlur={this.onBlur}
          elemBeforeInput={
            <span css={searchIcon}>
              <SearchIcon label="" />
            </span>
          }
        />
      </div>
    );
  }
}

export default injectIntl(EmojiPickerListSearch);
