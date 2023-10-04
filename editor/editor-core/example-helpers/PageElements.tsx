/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { themed } from '@atlaskit/theme/components';
import { DN900, N90 } from '@atlaskit/theme/colors';
import type { Provider } from '@atlaskit/collab-provider';
import type { ThemeProps } from '@atlaskit/theme/types';

export const titleArea: any = (props: ThemeProps) => css`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;
  width: 100%;
  resize: none;
  vertical-align: bottom;
  color: ${themed({ light: 'black', dark: DN900 })(props)};

  /* Blend into the page bg colour. This way it's theme agnostic. */
  background: transparent;

  &::placeholder {
    color: ${N90};
  }
`;
interface TitleInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (
    e: React.FormEvent<HTMLTextAreaElement>,
    provider?: Provider,
  ) => void;
  innerRef?: (ref: HTMLTextAreaElement) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  provider?: Provider;
}

interface TitleInputState {
  handleUpdate: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

export class TitleInput extends React.Component<
  TitleInputProps,
  TitleInputState
> {
  constructor(props: TitleInputProps) {
    super(props);
    this.state = {
      handleUpdate: (e: React.FormEvent<HTMLTextAreaElement>) => {
        this.handleTitleResize(e);
        if (props.onChange) {
          props.onChange!(e, props.provider!);
        }
      },
      placeholder: props.placeholder || 'Give this page a title...',
    };
  }

  render() {
    return (
      <textarea
        css={titleArea}
        id="editor-title"
        data-test-id="editor-title"
        placeholder={this.state.placeholder}
        rows={1}
        value={this.props.value}
        onChange={this.state.handleUpdate}
        ref={this.props.innerRef}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onKeyDown={this.props.onKeyDown}
      />
    );
  }

  private handleTitleResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const elem = e.target as HTMLInputElement;
    elem.style.height = 'inherit';
    elem.style.height = `${elem.scrollHeight}px`;
  };
}
