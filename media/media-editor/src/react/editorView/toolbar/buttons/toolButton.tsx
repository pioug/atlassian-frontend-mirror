import React from 'react';
import { Component } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import { N0 } from '@atlaskit/theme/colors';
import ArrowIcon from '@atlaskit/icon/glyph/media-services/arrow';
import BrushIcon from '@atlaskit/icon/glyph/media-services/brush';
import LineIcon from '@atlaskit/icon/glyph/media-services/line';
import BlurIcon from '@atlaskit/icon/glyph/media-services/blur';
import OvalIcon from '@atlaskit/icon/glyph/media-services/oval';
import RectIcon from '@atlaskit/icon/glyph/media-services/rectangle';
import TextIcon from '@atlaskit/icon/glyph/media-services/text';
import { Tool } from '../../../../common';
import { ButtonIconWrapper } from './styles';

export const toolIcons = {
  line: LineIcon,
  blur: BlurIcon,
  arrow: ArrowIcon,
  brush: BrushIcon,
  oval: OvalIcon,
  rectangle: RectIcon,
  text: TextIcon,
};

export interface ToolButtonProps {
  readonly tool: Tool;
  readonly activeTool: Tool;
  readonly onToolClick: (tool: Tool) => void;
}

export class ToolButton extends Component<ToolButtonProps> {
  render() {
    const { tool, activeTool, onToolClick } = this.props;
    const Icon = toolIcons[tool];
    const isActive = tool === activeTool;
    const iconPrimaryColor = isActive ? N0 : undefined;
    const onClick = () => {
      onToolClick(tool);
    };
    const iconBefore = (
      <ButtonIconWrapper>
        <Icon label={tool} size="medium" primaryColor={iconPrimaryColor} />
      </ButtonIconWrapper>
    );
    return (
      <Button
        iconBefore={iconBefore}
        appearance="subtle"
        onClick={onClick}
        isSelected={isActive}
      />
    );
  }
}
