/** @jsx jsx */
import React, { PureComponent } from 'react';

import { jsx } from '@emotion/react';

import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { N0 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';

import { buttonStyle, buttonWrapperStyle } from './styles';

export interface Props {
  value: string;
  label: string;
  tabIndex?: number;
  isSelected?: boolean;
  onClick: (value: string, label: string) => void;
  borderColor: string;
  checkMarkColor?: string;
  autoFocus?: boolean;
  /**
   * When set to true -- the presentation of colors in the
   * palette will use design tokens when available.
   */
  useDesignTokens: boolean;
}

class Color extends PureComponent<Props> {
  render() {
    const {
      autoFocus,
      tabIndex,
      value,
      label,
      isSelected,
      borderColor,

      /** this is not new usage - old code extracted from editor-core */
      /* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
      checkMarkColor = N0,
      /* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
      useDesignTokens,
    } = this.props;

    const colorStyle = useDesignTokens
      ? hexToEditorTextPaletteColor(value)
      : value;
    return (
      <Tooltip content={label}>
        <span css={buttonWrapperStyle}>
          <button
            css={buttonStyle}
            aria-label={label}
            role="radio"
            aria-checked={isSelected}
            onClick={this.onClick}
            onMouseDown={this.onMouseDown}
            tabIndex={tabIndex}
            className={`${isSelected ? 'selected' : ''}`}
            style={{
              backgroundColor: colorStyle || 'transparent',
              border: `1px solid ${borderColor}`,
            }}
            autoFocus={autoFocus}
          >
            {isSelected && (
              <EditorDoneIcon primaryColor={checkMarkColor} label="" />
            )}
          </button>
        </span>
      </Tooltip>
    );
  }

  onMouseDown = (e: React.MouseEvent<{}>) => {
    e.preventDefault();
  };

  onClick = (e: React.MouseEvent<{}>) => {
    const { onClick, value, label } = this.props;
    e.preventDefault();
    onClick(value, label);
  };
}

export default Color;
