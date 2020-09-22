import React from 'react';
import { Component } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';
import { messages } from '@atlaskit/media-ui';
import { N0 } from '@atlaskit/theme/colors';
import { toolIcons } from './toolButton';
import { Tool } from '../../../../common';
import { shapeTools } from '../popups/shapePopup';
import { DropdownLeftIconWrapper, DropdownRightIconWrapper } from './styles';

export interface ShapeButtonProps {
  readonly activeShape: Tool;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class ShapeButton extends Component<
  ShapeButtonProps & InjectedIntlProps
> {
  render() {
    const {
      isActive,
      onClick,
      activeShape,
      intl: { formatMessage },
    } = this.props;
    const iconPrimaryColor = isActive ? N0 : undefined;
    const isShapeTool = shapeTools.indexOf(activeShape) > -1;
    const Icon = toolIcons[isShapeTool ? activeShape : shapeTools[0]];

    const iconBefore = (
      <DropdownLeftIconWrapper>
        <Icon
          label={activeShape}
          size="medium"
          primaryColor={iconPrimaryColor}
        />
      </DropdownLeftIconWrapper>
    );
    const iconAfter = (
      <DropdownRightIconWrapper>
        <ChevronDownIcon label="chevron-icon" primaryColor={iconPrimaryColor} />
      </DropdownRightIconWrapper>
    );

    return (
      <Tooltip content={formatMessage(messages.annotate_tool_shape)}>
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

export default injectIntl(ShapeButton);
