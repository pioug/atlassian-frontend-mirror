import React from 'react';
import { PureComponent } from 'react';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import {
  ColorCardOption,
  ColorCardContent,
  ColorCardContentCheckMark,
} from '../styled/ColorCard';
import { KEY_SPACE, KEY_ENTER } from '../constants';

export interface Props {
  value: string;
  label: string;
  onClick?: (value: string) => void;
  onKeyDown?: (value: string) => void;
  checkMarkColor?: string;
  selected?: boolean;
  focused?: boolean;
  isOption?: boolean;
  isTabbing?: boolean;
}

export default class ColorCard extends PureComponent<Props> {
  onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { onClick, value } = this.props;

    if (onClick) {
      event.preventDefault();
      onClick(value);
    }
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const { key } = event;
    const { onKeyDown, value, isTabbing } = this.props;

    if (
      (isTabbing === undefined || isTabbing) &&
      onKeyDown &&
      (key === KEY_ENTER || key === KEY_SPACE)
    ) {
      event.preventDefault();
      if (isTabbing) {
        event.stopPropagation();
      }
      onKeyDown(value);
    }
  };

  ref: React.RefObject<HTMLButtonElement> = React.createRef();

  render() {
    const {
      value,
      label,
      selected,
      focused,
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      checkMarkColor = colors.N0,
      isTabbing,
    } = this.props;

    return (
      <Tooltip content={label}>
        <ColorCardOption
          onClick={this.onClick}
          onMouseDown={this.onMouseDown}
          focused={focused}
          role="radio"
          aria-checked={selected}
          aria-label={label}
          tabIndex={0}
          onKeyDown={this.onKeyDown}
          isTabbing={isTabbing}
        >
          <ColorCardContent color={value || 'transparent'}>
            {selected && (
              <ColorCardContentCheckMark>
                <EditorDoneIcon primaryColor={checkMarkColor} label="" />
              </ColorCardContentCheckMark>
            )}
          </ColorCardContent>
        </ColorCardOption>
      </Tooltip>
    );
  }
}
