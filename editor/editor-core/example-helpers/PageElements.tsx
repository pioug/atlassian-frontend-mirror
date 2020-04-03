import React from 'react';
import styled from 'styled-components';
import { colors, themed } from '@atlaskit/theme';

export const TitleArea: any = styled.textarea`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;
  width: 100%;
  resize: none;
  vertical-align: bottom;
  color: ${themed({ light: 'black', dark: colors.DN900 })};

  /* Blend into the page bg colour. This way it's theme agnostic. */
  background: transparent;

  &::placeholder {
    color: ${colors.N90};
  }
`;
TitleArea.displayName = 'TitleArea';

interface TitleInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (e: KeyboardEvent) => void;
  innerRef?: (ref?: HTMLElement) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
}

interface TitleInputState {
  handleUpdate: (e: KeyboardEvent) => void;
  placeholder: string;
}

export class TitleInput extends React.Component<
  TitleInputProps,
  TitleInputState
> {
  constructor(props: TitleInputProps) {
    super(props);
    this.state = {
      handleUpdate: (e: KeyboardEvent) => {
        this.handleTitleResize(e);
        if (props.onChange) {
          props.onChange!(e);
        }
      },
      placeholder: props.placeholder || 'Give this page a title...',
    };
  }

  render() {
    return (
      <TitleArea
        id="editor-title"
        placeholder={this.state.placeholder}
        rows="1"
        value={this.props.value}
        onChange={this.state.handleUpdate}
        innerRef={this.props.innerRef}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onKeyDown={this.props.onKeyDown}
      />
    );
  }

  private handleTitleResize = (e: KeyboardEvent) => {
    const elem = e.target as HTMLInputElement;
    elem.style.height = 'inherit';
    elem.style.height = `${elem.scrollHeight}px`;
  };
}
