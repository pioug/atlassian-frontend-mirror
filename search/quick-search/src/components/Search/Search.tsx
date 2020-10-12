import React from 'react';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';
import {
  SearchBox,
  SearchFieldBaseInner,
  SearchInner,
  SearchInput,
  SearchFieldBaseOuter,
  SearchInputControlsContainer,
  SearchInputTypeAhead,
} from './styled';

export const controlKeys = [
  'ArrowUp',
  'ArrowDown',
  'Enter',
  'Tab',
  'ArrowRight',
];

const SpinnerParent = styled.div`
  height: 20px;
  margin-left: 10px;
  margin-top: 10px;
`;

type Props = {
  /** The elements to render as options to search from. */
  children?: React.ReactNode;
  /** The elements to render to the right of the search input. */
  inputControls?: React.ReactNode;
  /** Set whether the loading state should be shown. */
  isLoading?: boolean;
  /** Function to be called when the search input loses focus. */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Function to be called when a input action occurs (native `oninput` event). */
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  /** Function to be called when the user hits the escape key.  */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Placeholder text for search field. */
  placeholder?: string;
  /** Current value of search field. */
  value?: string;
  /** Autocomplete information */
  autocompleteText?: string;
};

export default class Search extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    isLoading: false,
    onBlur: () => {},
    placeholder: 'Search',
  };

  onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { onKeyDown } = this.props;
    if (!controlKeys.includes(event.key)) {
      return;
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
    event.stopPropagation();
  };

  setInputRef = (ref: React.Ref<any>) => {
    this.inputRef = ref;
  };

  renderInputControls = () => {
    return this.props.inputControls ? (
      <SearchInputControlsContainer>
        {this.props.inputControls}
      </SearchInputControlsContainer>
    ) : null;
  };

  inputRef?: React.Ref<any>;

  render() {
    const {
      children,
      onBlur,
      onInput,
      placeholder,
      isLoading,
      value,
      autocompleteText: autocomplete,
    } = this.props;

    return (
      <SearchInner>
        <SearchBox>
          <SearchFieldBaseOuter>
            <SearchFieldBaseInner>
              {autocomplete && (
                <SearchInputTypeAhead
                  spellCheck={false}
                  type="text"
                  value={`${autocomplete}`}
                  readOnly
                  tabIndex={-1}
                />
              )}
              <SearchInput
                autoFocus
                innerRef={this.setInputRef}
                onBlur={onBlur}
                onInput={onInput}
                placeholder={placeholder}
                spellCheck={false}
                type="text"
                value={value}
                onChange={() => {}} // Suppresses the console warning, we handle onChange by using onKeyDown instead.
                onKeyDown={this.onInputKeyDown}
              />
              {isLoading && (
                <SpinnerParent>
                  <Spinner size="small" />
                </SpinnerParent>
              )}
            </SearchFieldBaseInner>
          </SearchFieldBaseOuter>
          {this.renderInputControls()}
        </SearchBox>
        {children}
      </SearchInner>
    );
  }
}
