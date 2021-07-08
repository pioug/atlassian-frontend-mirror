import AkFieldBase from '@atlaskit/field-base';
import SearchIcon from '@atlaskit/icon/glyph/search';
import React from 'react';
import { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Styles } from '../../types';
import { messages } from '../i18n';
import * as styles from './styles';

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

export default class EmojiPickerListSearch extends PureComponent<Props> {
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
      window.setTimeout(this.focusInput);
    }
  };

  render() {
    const { style, query } = this.props;

    return (
      <div className={styles.pickerSearch} style={style}>
        <FormattedMessage {...messages.searchPlaceholder}>
          {(searchPlaceholder) => (
            <AkFieldBase
              appearance="standard"
              isCompact
              isFitContainerWidthEnabled
            >
              <span className={styles.searchIcon}>
                <SearchIcon label="" />
              </span>
              <FormattedMessage {...messages.searchLabel}>
                {(searchLabel) => (
                  <input
                    aria-label={searchLabel as string}
                    className={styles.input}
                    autoComplete="off"
                    disabled={false}
                    name="search"
                    placeholder={`${searchPlaceholder as string}...`}
                    required={false}
                    onChange={this.onChange}
                    value={query || ''}
                    ref={this.handleInputRef}
                    onBlur={this.onBlur}
                  />
                )}
              </FormattedMessage>
            </AkFieldBase>
          )}
        </FormattedMessage>
      </div>
    );
  }
}
