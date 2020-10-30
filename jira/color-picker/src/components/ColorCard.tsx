import React from 'react';
import { PureComponent } from 'react';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { ColorCardOption, ColorCardContent } from '../styled/ColorCard';
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
    const { onKeyDown, value } = this.props;
    if (onKeyDown && (key === KEY_ENTER || key === KEY_SPACE)) {
      event.preventDefault();
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
      checkMarkColor = colors.N0,
    } = this.props;

    return (
      <ColorCardOption
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        focused={focused}
        aria-label={`${label}${selected ? ' selected' : ''}`}
        tabIndex={0}
        onKeyDown={this.onKeyDown}
      >
        <ColorCardContent color={value || 'transparent'}>
          {selected && (
            <EditorDoneIcon primaryColor={checkMarkColor} label="" />
          )}
        </ColorCardContent>
      </ColorCardOption>
    );
  }
}
