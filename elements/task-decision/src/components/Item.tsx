/** @jsx jsx */

import { PureComponent } from 'react';
import { jsx } from '@emotion/react';
import { Appearance, ContentRef, TaskType, DecisionType } from '../types';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import type { Theme } from '@atlaskit/theme/types';
import {
  contentStyles,
  taskStyles,
  decisionStyles,
  placeholderStyles,
} from './styles';

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
  theme: Theme;
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

    // TODO: Migrate away from gridSize
    // Recommendation: Replace gridSize with 8
    const offset = gridSize() * (itemType === 'TASK' ? 3 : 3.5);
    return (
      <span
        data-component="placeholder"
        css={placeholderStyles(offset)}
        contentEditable={false}
      >
        {placeholder}
      </span>
    );
  }

  renderMessageAppearance() {
    const {
      contentRef,
      children,
      icon,
      itemType,
      checkBoxId,
      dataAttributes,
      theme,
    } = this.props;

    if (itemType === 'TASK') {
      return (
        <div css={taskStyles} id={`${checkBoxId}-wrapper`}>
          {icon}
          {this.renderPlaceholder()}
          <div
            data-component="content"
            css={contentStyles}
            ref={contentRef}
            {...dataAttributes}
          >
            {children}
          </div>
        </div>
      );
    } else if (itemType === 'DECISION') {
      return (
        <div css={decisionStyles(theme)} data-decision-wrapper="true">
          {icon}
          {this.renderPlaceholder()}
          <div
            data-component="content"
            css={contentStyles}
            ref={contentRef}
            {...dataAttributes}
          >
            {children}
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    return this.renderMessageAppearance();
  }
}
