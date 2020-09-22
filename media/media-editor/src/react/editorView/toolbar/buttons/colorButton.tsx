import React from 'react';
import { Component } from 'react';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import { N0 } from '@atlaskit/theme/colors';
import {
  ColorSample,
  DropdownRightIconWrapper,
  DropdownLeftIconWrapper,
} from './styles';
import { messages } from '@atlaskit/media-ui';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { PICKER_COLORS } from '../popups/colorPopup';

export interface ColorButtonProps {
  readonly color: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class ColorButton extends Component<
  ColorButtonProps & InjectedIntlProps
> {
  render() {
    const {
      color,
      isActive,
      onClick,
      intl: { formatMessage },
    } = this.props;

    const iconPrimaryColor = isActive ? N0 : undefined;
    const style = { backgroundColor: color, borderColor: PICKER_COLORS[color] };

    const iconBefore = (
      <DropdownLeftIconWrapper>
        <ColorSample style={style} />
      </DropdownLeftIconWrapper>
    );
    const iconAfter = (
      <DropdownRightIconWrapper>
        <ChevronDownIcon label="chevron-icon" primaryColor={iconPrimaryColor} />
      </DropdownRightIconWrapper>
    );
    return (
      <Tooltip content={formatMessage(messages.annotate_tool_color)}>
        <Button
          iconBefore={iconBefore}
          iconAfter={iconAfter}
          appearance="subtle"
          onClick={onClick}
          isSelected={isActive}
        />
      </Tooltip>
    );
  }
}

export default injectIntl(ColorButton);
