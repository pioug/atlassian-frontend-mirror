/** @jsx jsx */
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { N900, N0, N50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { css, jsx } from '@emotion/react';
import { ANALYTICS_HOVER_DELAY } from '../constants';
import { messages } from '../i18n';
import { Color as ColorType } from '../Status';

const buttonStyles = css`
  height: 24px;
  width: 24px;
  background: ${token('color.background.neutral', N900)};
  padding: 0;
  border-radius: 4px;
  border: 1px solid ${token('color.border', N0)};
  cursor: pointer;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
`;

// We have tried with changing border and padding from 1px to token near version 2px,
// the pop - up is being expanded to two lines.
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
const buttonWrapperStyles = css`
  border: 1px solid transparent;
  margin: 0 ${token('space.025', '2px')};
  font-size: 0;
  display: flex;
  align-items: center;
  padding: 1px;
  border-radius: ${token('space.075', '6px')};
  &:hover {
    border: 1px solid ${token('color.border', N50)};
  }
`;

export interface ColorProps {
  value: ColorType;
  tabIndex?: number;
  isSelected?: boolean;
  onClick: (value: ColorType) => void;
  onHover?: (value: ColorType) => void;
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
  setRef?: (value: HTMLButtonElement) => HTMLButtonElement;
}

export default class Color extends PureComponent<ColorProps> {
  private hoverStartTime: number = 0;

  render() {
    const {
      tabIndex,
      backgroundColor,
      isSelected,
      borderColor,
      iconColor,
      value,
      setRef,
    } = this.props;
    return (
      <li css={buttonWrapperStyles}>
        <FormattedMessage
          {...messages[`${value}Color` as keyof typeof messages]}
        >
          {(labels) => (
            <button
              css={buttonStyles}
              onClick={this.onClick}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              onMouseDown={this.onMouseDown}
              tabIndex={tabIndex}
              className={`${isSelected ? 'selected' : ''}`}
              title={labels[0] as string}
              // button element does not support aria-selected.
              // For button selected (to be precise pressed) or not
              //  use aria-pressed as per
              // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role#associated_aria_roles_states_and_properties
              aria-pressed={isSelected}
              style={{
                backgroundColor: backgroundColor || 'transparent',
                borderColor,
              }}
              ref={setRef}
            >
              {isSelected && (
                <EditorDoneIcon
                  primaryColor={iconColor}
                  label={labels[0] as string}
                />
              )}
            </button>
          )}
        </FormattedMessage>
      </li>
    );
  }

  componentWillUnmount() {
    this.hoverStartTime = 0;
  }

  onMouseEnter = () => {
    this.hoverStartTime = Date.now();
  };

  onMouseLeave = () => {
    const { onHover } = this.props;
    const delay = Date.now() - this.hoverStartTime;

    if (delay >= ANALYTICS_HOVER_DELAY && onHover) {
      onHover(this.props.value);
    }
    this.hoverStartTime = 0;
  };

  onMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
  };

  onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const { onClick, value } = this.props;
    e.preventDefault();
    onClick(value);
  };
}
