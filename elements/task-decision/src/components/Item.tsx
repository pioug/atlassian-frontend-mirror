import React from 'react';
import { PureComponent } from 'react';
import { gridSize } from '@atlaskit/theme/constants';

import { ContentWrapper, TaskWrapper, DecisionWrapper } from '../styled/Item';

import { Appearance, ContentRef, TaskType, DecisionType } from '../types';
import { Placeholder } from '../styled/Placeholder';

export interface Props {
  icon: JSX.Element;
  itemType: TaskType | DecisionType;
  children?: any;
  appearance?: Appearance;
  contentRef?: ContentRef;
  placeholder?: string;
  showPlaceholder?: boolean;
  dataAttributes?: { [key: string]: string | number };
  checkBoxId?: string;
}

export default class Item extends PureComponent<Props, {}> {
  public static defaultProps: Partial<Props> = {
    appearance: 'inline',
  };

  private renderPlaceholder() {
    const { children, placeholder, showPlaceholder, itemType } = this.props;
    if (!showPlaceholder || !placeholder || children) {
      return null;
    }

    const offset = gridSize() * (itemType === 'TASK' ? 3 : 3.5);
    return (
      <Placeholder contentEditable={false} offset={offset}>
        {placeholder}
      </Placeholder>
    );
  }

  renderMessageAppearance() {
    const {
      contentRef,
      children,
      icon,
      itemType,
      dataAttributes,
      checkBoxId,
    } = this.props;

    if (itemType === 'TASK') {
      return (
        <TaskWrapper id={`${checkBoxId}-wrapper`}>
          {icon}
          {this.renderPlaceholder()}
          <ContentWrapper {...dataAttributes} innerRef={contentRef}>
            {children}
          </ContentWrapper>
        </TaskWrapper>
      );
    } else if (itemType === 'DECISION') {
      return (
        <DecisionWrapper data-decision-wrapper="true">
          {icon}
          {this.renderPlaceholder()}
          <ContentWrapper {...dataAttributes} innerRef={contentRef}>
            {children}
          </ContentWrapper>
        </DecisionWrapper>
      );
    }

    return null;
  }

  render() {
    return this.renderMessageAppearance();
  }
}
