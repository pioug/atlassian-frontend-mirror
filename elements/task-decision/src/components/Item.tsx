/** @jsx jsx */

import { PureComponent } from 'react';
import { css, jsx } from '@emotion/react';
import { Appearance, ContentRef, TaskType, DecisionType } from '../types';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';
import { DN50, N100, N20A } from '@atlaskit/theme/colors';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import type { Theme } from '@atlaskit/theme/types';

const contentStyle = css({
  margin: 0,
  wordWrap: 'break-word',
  minWidth: 0,
  flex: '1 1 auto',
});

const taskStyles = css({
  display: 'flex',
  flexDirection: 'row',
  padding: '6px 3px',
  position: 'relative',
});

const decisionStyles = (theme: Theme) =>
  css({
    display: 'flex',
    flexDirection: 'row',
    margin: `${gridSize()}px 0 0 0`,
    padding: `${gridSize()}px`,
    paddingLeft: `${gridSize() * 1.5}px`,
    borderRadius: `${borderRadius()}px`,
    backgroundColor: themed({
      light: token('color.background.neutral', N20A),
      dark: token('color.background.neutral', DN50),
    })({ theme }),
    position: 'relative',

    '.decision-item': {
      cursor: 'initial',
    },
  });

const placeHolderStyles = (offset: number) =>
  css({
    margin: `0 0 0 ${offset}px`,
    position: 'absolute',
    color: token('color.text.subtlest', N100),
    pointerEvents: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: 'calc(100% - 50px)',
  });

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

    const offset = gridSize() * (itemType === 'TASK' ? 3 : 3.5);
    return (
      <span
        data-component="placeholder"
        css={placeHolderStyles(offset)}
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
            css={contentStyle}
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
            css={contentStyle}
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
