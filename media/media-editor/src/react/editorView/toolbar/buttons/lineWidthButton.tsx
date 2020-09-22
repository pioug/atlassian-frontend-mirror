import React from 'react';
import { Component } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Button from '@atlaskit/button/custom-theme-button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import Tooltip from '@atlaskit/tooltip';
import { messages } from '@atlaskit/media-ui';
import { N0 } from '@atlaskit/theme/colors';
import { DropdownRightIconWrapper, DropdownLeftIconWrapper } from './styles';
import { LineWidthIcon } from './lineWidthIcon';

export interface LineWidthButtonProps {
  readonly lineWidth: number;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class LineWidthButton extends Component<
  LineWidthButtonProps & InjectedIntlProps
> {
  render() {
    const {
      isActive,
      lineWidth,
      onClick,
      intl: { formatMessage },
    } = this.props;
    const iconPrimaryColor = isActive ? N0 : undefined;

    const iconBefore = (
      <DropdownLeftIconWrapper>
        <LineWidthIcon
          isActive={isActive}
          lineWidth={lineWidth}
          onLineWidthClick={() => {}}
        />
      </DropdownLeftIconWrapper>
    );
    const iconAfter = (
      <DropdownRightIconWrapper>
        <ChevronDownIcon label="chevron-icon" primaryColor={iconPrimaryColor} />
      </DropdownRightIconWrapper>
    );
    return (
      <Tooltip content={formatMessage(messages.annotate_tool_line_thickness)}>
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

export default injectIntl(LineWidthButton);
