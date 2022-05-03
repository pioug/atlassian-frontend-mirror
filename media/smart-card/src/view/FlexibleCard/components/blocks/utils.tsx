import React from 'react';
import { css, SerializedStyles } from '@emotion/core';

import { ActionItem, ElementItem } from './types';
import {
  ElementName,
  SmartLinkDirection,
  SmartLinkSize,
} from '../../../../constants';
import * as Elements from '../elements';
import * as Actions from '../actions';
import { isFlexibleUiElement } from '../../../../utils/flexible';
import ActionGroup from './action-group';
import ElementGroup from './element-group';
import { ActionProps } from '../actions/action/types';
import { Appearance } from '@atlaskit/button';

// Determine whether the element can be display as inline/block.
export type ElementDisplaySchemaType = 'inline' | 'block';
export const ElementDisplaySchema: Record<
  ElementName,
  ElementDisplaySchemaType[]
> = {
  [ElementName.AuthorGroup]: ['inline'],
  [ElementName.CollaboratorGroup]: ['inline'],
  [ElementName.CommentCount]: ['inline'],
  [ElementName.ViewCount]: ['inline'],
  [ElementName.ReactCount]: ['inline'],
  [ElementName.VoteCount]: ['inline'],
  [ElementName.CreatedBy]: ['inline'],
  [ElementName.CreatedOn]: ['inline'],
  [ElementName.LinkIcon]: ['inline'],
  [ElementName.ModifiedBy]: ['inline'],
  [ElementName.ModifiedOn]: ['inline'],
  [ElementName.Preview]: ['block'],
  [ElementName.Priority]: ['inline'],
  [ElementName.ProgrammingLanguage]: ['inline'],
  [ElementName.Snippet]: ['block'],
  [ElementName.State]: ['inline'],
  [ElementName.SubscriberCount]: ['inline'],
  [ElementName.Title]: ['inline'],
  [ElementName.Provider]: ['inline'],
};

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

const isElementDisplayValid = (
  name: ElementName,
  display: ElementDisplaySchemaType,
): boolean => {
  return ElementDisplaySchema[name]?.includes(display) ?? false;
};

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
  display: ElementDisplaySchemaType = 'inline',
): React.ReactNode | undefined => {
  const elements = items.reduce(
    (acc: React.ReactElement[], curr: ElementItem, idx: number) => {
      const { name, ...props } = curr;
      const Element = Elements[name];
      if (Element && isElementDisplayValid(name, display)) {
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
  appearance?: Appearance,
  asDropDownItems?: boolean,
): React.ReactNode | undefined => {
  const actions = items.reduce(
    (acc: React.ReactElement[], curr: ActionItem, idx: number) => {
      const { name, hideContent, hideIcon, onClick, ...props } = curr;
      const Action = Actions[name];
      const actionProps: Partial<ActionProps> = {
        ...props,
      };
      if (hideContent && !asDropDownItems) {
        actionProps.content = '';
      }
      if (hideIcon) {
        actionProps.icon = undefined;
      }
      if (Action) {
        return [
          ...acc,
          <Action
            asDropDownItem={asDropDownItems}
            size={size}
            key={idx}
            appearance={appearance}
            onClick={onClick}
            {...actionProps}
          />,
        ];
      }
      return acc;
    },
    [],
  );

  if (actions.length) {
    return actions;
  }
};
