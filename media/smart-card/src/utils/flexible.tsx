import React from 'react';

import * as Blocks from '../view/FlexibleCard/components/blocks';
import { TitleBlock } from '../view/FlexibleCard/components/blocks';
import * as Elements from '../view/FlexibleCard/components/elements';

export const isFlexibleUiCard = (children?: React.ReactNode): boolean => {
  if (
    children &&
    React.Children.toArray(children).some((child) =>
      isFlexibleUiTitleBlock(child),
    )
  ) {
    return true;
  }
  return false;
};

export const isFlexibleUiBlock = (node: React.ReactNode): boolean =>
  React.isValidElement(node) &&
  Object.values(Blocks).some((type) => type === node.type);

export const isFlexibleUiElement = (node: React.ReactNode): boolean =>
  React.isValidElement(node) &&
  Object.values(Elements).some((type) => type === node.type);

export const isFlexibleUiTitleBlock = (node: React.ReactNode): boolean =>
  React.isValidElement(node) && node.type === TitleBlock;
