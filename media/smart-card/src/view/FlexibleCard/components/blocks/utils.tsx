import React from 'react';
import { css, SerializedStyles } from '@emotion/core';

import { ActionItem, ElementItem } from './types';
import { SmartLinkDirection, SmartLinkSize } from '../../../../constants';
import * as Elements from '../elements';
import * as Actions from '../actions';
import { isFlexibleUiElement } from '../../../../utils/flexible';
import ActionGroup from './action-group';
import ElementGroup from './element-group';

const getDirectionStyles = (
  direction?: SmartLinkDirection,
): SerializedStyles => {
  switch (direction) {
    case SmartLinkDirection.Vertical:
      return css`
        flex-direction: column;
        align-items: flex-start;
      `;
    case SmartLinkDirection.Horizontal:
    default:
      return css`
        flex-direction: row;
        align-items: center;
      `;
  }
};

export const getGapSize = (size: SmartLinkSize): number => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return 1.25;
    case SmartLinkSize.Large:
      return 1;
    case SmartLinkSize.Medium:
      return 0.5;
    case SmartLinkSize.Small:
    default:
      return 0.25;
  }
};

export const getBaseStyles = (
  direction: SmartLinkDirection,
  size: SmartLinkSize,
): SerializedStyles => css`
  display: flex;
  gap: ${getGapSize(size)}rem;
  line-height: 1rem;
  min-width: 0;
  overflow: hidden;
  overflow-y: hidden;
  ${getDirectionStyles(direction)};
  &:empty {
    display: none;
  }
  & > * {
    min-width: 0;
  }
  & > [data-fit-to-content] {
    min-width: fit-content;
  }
`;

const isActionGroup = (node: React.ReactNode) =>
  React.isValidElement(node) && node.type === ActionGroup;

const isElementNull = (children: JSX.Element) => {
  return Boolean(children.type() === null);
};

const isElementOrElementGroup = (node: React.ReactNode) =>
  React.isValidElement(node) &&
  (isFlexibleUiElement(node) || node.type === ElementGroup);

export const renderChildren = (
  children: React.ReactNode,
  size: SmartLinkSize,
): React.ReactNode =>
  React.Children.map(children, (child) => {
    if (isElementOrElementGroup(child) || isActionGroup(child)) {
      const node = child as React.ReactElement;
      const { size: childSize } = node.props;
      return React.cloneElement(node, { size: childSize || size });
    }
    return child;
  });

export const renderElementItems = (
  items: ElementItem[] = [],
): React.ReactNode | undefined => {
  const elements = items.reduce(
    (acc: React.ReactElement[], curr: ElementItem, idx: number) => {
      const { name, ...props } = curr;
      const Element = Elements[name];
      if (Element) {
        const element = <Element key={idx} {...props} />;
        if (!isElementNull(element)) {
          return [...acc, element];
        }
      }
      return acc;
    },
    [],
  );

  if (elements.length) {
    return elements;
  }
};

export const renderActionItems = (
  items: ActionItem[] = [],
  size: SmartLinkSize = SmartLinkSize.Medium,
): React.ReactNode | undefined => {
  const actions = items.reduce(
    (acc: React.ReactElement[], curr: ActionItem, idx: number) => {
      const { name, ...props } = curr;
      const Action = Actions[name];
      if (Action) {
        return [...acc, <Action size={size} key={idx} {...props} />];
      }
      return acc;
    },
    [],
  );

  if (actions.length) {
    return actions;
  }
};
