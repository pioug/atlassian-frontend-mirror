import React from 'react';
import { Component } from 'react';
import InlineDialog from '@atlaskit/inline-dialog';
import Button from '@atlaskit/button/custom-theme-button';

import { ShapePopupContentWrapper } from './popupStyles';
import { Tool } from '../../../../common';
import { toolIcons } from '../buttons/toolButton';
import { ShapeTitle } from '../buttons/styles';

export const shapeTools: Tool[] = ['rectangle', 'oval', 'line'];

export interface ShapePopupProps {
  readonly isOpen: boolean;
  readonly shape: Tool;
  readonly onPickShape: (tool: Tool) => void;
}

export class ShapePopup extends Component<ShapePopupProps> {
  render() {
    const { isOpen, children } = this.props;
    const content = (
      <ShapePopupContentWrapper>
        {this.renderButtons()}
      </ShapePopupContentWrapper>
    );
    return (
      <InlineDialog isOpen={isOpen} placement="top-start" content={content}>
        {children}
      </InlineDialog>
    );
  }

  private renderButtons(): JSX.Element[] {
    const { onPickShape, shape: currentShape } = this.props;

    return shapeTools.map((shape) => {
      const isSelected = shape === currentShape;

      const Icon = toolIcons[shape];

      const icon = <Icon label={shape} />;
      const onClick = () => onPickShape(shape);

      return (
        <Button
          appearance="subtle"
          key={shape}
          isSelected={isSelected}
          shouldFitContainer
          iconBefore={icon}
          onClick={onClick}
        >
          <ShapeTitle>{shape}</ShapeTitle>
        </Button>
      );
    });
  }
}
