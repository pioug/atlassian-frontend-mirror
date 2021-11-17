import React from 'react';
import { PureComponent } from 'react';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { N0 } from '@atlaskit/theme/colors';
import { Button, ButtonWrapper } from './styles';
import Tooltip from '@atlaskit/tooltip';

export interface Props {
  value: string;
  label: string;
  tabIndex?: number;
  isSelected?: boolean;
  onClick: (value: string, label: string) => void;
  borderColor: string;
  checkMarkColor?: string;
  autoFocus?: boolean;
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
      checkMarkColor = N0,
    } = this.props;

    return (
      <Tooltip content={label}>
        <ButtonWrapper>
          <Button
            aria-label={label}
            role="radio"
            aria-checked={isSelected}
            onClick={this.onClick}
            onMouseDown={this.onMouseDown}
            tabIndex={tabIndex}
            className={`${isSelected ? 'selected' : ''}`}
            style={{
              backgroundColor: value || 'transparent',
              border: `1px solid ${borderColor}`,
            }}
            autoFocus={autoFocus}
          >
            {isSelected && (
              <EditorDoneIcon primaryColor={checkMarkColor} label="" />
            )}
          </Button>
        </ButtonWrapper>
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
