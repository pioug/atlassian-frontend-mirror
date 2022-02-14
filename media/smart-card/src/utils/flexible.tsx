import React from 'react';

import { CardAppearance } from '../view/Card';
import * as Blocks from '../view/FlexibleCard/components/blocks';
import { TitleBlock } from '../view/FlexibleCard/components/blocks';
import * as Elements from '../view/FlexibleCard/components/elements';

export const isFlexibleUiCard = (
  appearance: CardAppearance,
  children?: React.ReactNode,
): boolean => {
  if (
    (appearance === 'inline' || appearance === 'block') &&
    children &&
    React.Children.toArray(children).some((child) => isFlexibleUiBlock(child))
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
