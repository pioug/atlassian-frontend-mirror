/** @jsx jsx */
import TextField from '@atlaskit/textfield';
import { gridSize } from '@atlaskit/theme/constants';
import React, { FormEvent, PureComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { css, jsx } from '@emotion/react';
import ColorPalette from './internal/color-palette';
import { Color } from './Status';
import { messages } from './i18n';

export type ColorType = Color;

const fieldTextWrapperStyles = css`
  margin: 0 ${gridSize()}px;
`;

export interface Props {
  selectedColor: ColorType;
  text: string;
  onEnter: () => void;
  onColorClick: (value: ColorType) => void;
  onColorHover?: (value: ColorType) => void;
  onTextChanged: (value: string) => void;
  autoFocus?: boolean;
}

class Picker extends PureComponent<Props & WrappedComponentProps, any> {
  private fieldTextWrapperKey = Math.random().toString();
  private colorPaletteKey = Math.random().toString();

  static defaultProps = {
    autoFocus: true,
  };

  render() {
    const {
      text,
      selectedColor,
      onColorClick,
      onColorHover,
      intl,
    } = this.props;

    // Using <React.Fragment> instead of [] to workaround Enzyme
    // (https://github.com/airbnb/enzyme/issues/1149)
    return (
      <React.Fragment>
        <div css={fieldTextWrapperStyles} key={this.fieldTextWrapperKey}>
          <TextField
            value={text}
            isCompact
            ref={this.handleInputRef}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
            spellCheck={false}
            autoComplete="off"
            aria-label={intl.formatMessage(messages.statusInputLabel)}
          />
        </div>
        <ColorPalette
          key={this.colorPaletteKey}
          onClick={onColorClick}
          onHover={onColorHover}
          selectedColor={selectedColor}
        />
      </React.Fragment>
    );
  }

  private onChange = (evt: FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    this.props.onTextChanged(evt.target.value);
  };

  private onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.props.onEnter();
    }
  };

  private handleInputRef = (ref?: HTMLInputElement) => {
    if (ref && this.props.autoFocus) {
      // Defer to prevent editor scrolling to top (See FS-3227, also ED-2992)
      setTimeout(() => {
        ref.focus();
      });
    }
  };
}

export const StatusPicker = injectIntl(Picker);
