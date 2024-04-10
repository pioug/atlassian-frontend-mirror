import React from 'react';
import { css, SerializedStyles } from '@emotion/react';

import { ActionItem, ElementItem } from './types';
import {
  ActionName,
  ElementName,
  SmartLinkDirection,
  SmartLinkSize,
} from '../../../../constants';
import * as Elements from '../elements';
import { isFlexibleUiElement } from '../../../../utils/flexible';
import ActionGroup from './action-group';
import ElementGroup from './element-group';
import type { FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';

// Determine whether the element can be display as inline/block.
export type ElementDisplaySchemaType = 'inline' | 'block';
export const ElementDisplaySchema: Record<
  ElementName,
  ElementDisplaySchemaType[]
> = {
  [ElementName.AssignedTo]: ['inline'],
  [ElementName.AssignedToGroup]: ['inline'],
  [ElementName.AttachmentCount]: ['inline'],
  [ElementName.AuthorGroup]: ['inline'],
  [ElementName.ChecklistProgress]: ['inline'],
  [ElementName.CollaboratorGroup]: ['inline'],
  [ElementName.CommentCount]: ['inline'],
  [ElementName.CreatedBy]: ['inline'],
  [ElementName.CreatedOn]: ['inline'],
  [ElementName.DueOn]: ['inline'],
  [ElementName.LatestCommit]: ['inline'],
  [ElementName.LinkIcon]: ['inline'],
  [ElementName.Location]: ['inline'],
  [ElementName.ModifiedBy]: ['inline'],
  [ElementName.ModifiedOn]: ['inline'],
  [ElementName.OwnedBy]: ['inline'],
  [ElementName.OwnedByGroup]: ['inline'],
  [ElementName.Preview]: ['block'],
  [ElementName.Priority]: ['inline'],
  [ElementName.ProgrammingLanguage]: ['inline'],
  [ElementName.Provider]: ['inline'],
  [ElementName.ReactCount]: ['inline'],
  [ElementName.ReadTime]: ['inline'],
  [ElementName.Snippet]: ['block'],
  [ElementName.SourceBranch]: ['inline'],
  [ElementName.SentOn]: ['inline'],
  [ElementName.State]: ['inline'],
  [ElementName.SubscriberCount]: ['inline'],
  [ElementName.SubTasksProgress]: ['inline'],
  [ElementName.StoryPoints]: ['inline'],
  [ElementName.TargetBranch]: ['inline'],
  [ElementName.Title]: ['inline'],
  [ElementName.ViewCount]: ['inline'],
  [ElementName.VoteCount]: ['inline'],
};

const getDirectionStyles = (
  direction?: SmartLinkDirection,
): SerializedStyles => {
  switch (direction) {
    case SmartLinkDirection.Vertical:
      return css({
        flexDirection: 'column',
        alignItems: 'flex-start',
      });
    case SmartLinkDirection.Horizontal:
    default:
      return css({
        flexDirection: 'row',
        alignItems: 'center',
      });
  }
};

/**
 * Get gap size between elements inside a block
 * Equivalent version for DS primitives space token is getPrimitivesInlineSpaceBySize()
 * at view/FlexibleCard/components/utils.tsx
 */
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
): SerializedStyles =>
  css(
    {
      alignItems: 'center',
      display: 'flex',
      gap: `${getGapSize(size)}rem`,
      lineHeight: '1rem',
      minWidth: 0,
      overflow: 'hidden',
    },
    getDirectionStyles(direction),
    {
      '&:empty': {
        display: 'none',
      },
      '& > *': {
        minWidth: 0,
      },
      '& > [data-fit-to-content]': {
        minWidth: 'fit-content',
      },
    },
  );

export const highlightRemoveStyles = css`
  outline: none !important;
  outline-color: inherit;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const isActionGroup = (node: React.ReactNode) =>
  React.isValidElement(node) && node.type === ActionGroup;

const isElementDisplayValid = (
  name: ElementName,
  display: ElementDisplaySchemaType,
): boolean => {
  return ElementDisplaySchema[name]?.includes(display) ?? false;
};

export const isJSXElementNull = (children: JSX.Element) => {
  return Boolean(children.type() === null);
};

const isElementOrElementGroup = (node: React.ReactNode) =>
  React.isValidElement(node) &&
  (isFlexibleUiElement(node) || node.type === ElementGroup);

export const getActionGroupStyles = (
  size: SmartLinkSize,
): SerializedStyles | undefined => {
  if (size === SmartLinkSize.XLarge) {
    // The biggest height of the action button exceeds the max line-height
    // of the elements causing the action on the block with x-large size to
    // get cut at the bottom.
    return css({
      maxHeight: '2rem',
    });
  }
};

export const filterActionItems = (
  items: ActionItem[] = [],
  context?: FlexibleUiDataContext,
) => {
  return items.filter((item) => {
    switch (item.name) {
      case ActionName.DeleteAction:
      case ActionName.EditAction:
      case ActionName.CustomAction:
        // Named and custom actions that user defines.
        return Boolean(ActionName[item.name]);
      // Remove once ViewAction is retired
      // https://product-fabric.atlassian.net/browse/EDM-9547
      case ActionName.ViewAction:
        return Boolean(context?.viewAction);
      default:
        // Action that require data from the data context to render.
        return Boolean(context?.actions?.[item.name]);
    }
  });
};

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
      const typedProps = props as any;
      if (Element && isElementDisplayValid(name, display)) {
        const element = <Element key={idx} {...typedProps} />;
        if (!isJSXElementNull(element)) {
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
