import React from 'react';

type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface Icon {
  iconSize: IconSize;
  icon: React.ComponentType<{ label: string; size?: IconSize }>;
}

export interface IconTypeMap {
  connectivity: Icon;
  confirmation: Icon;
  info: Icon;
  warning: Icon;
  error: Icon;
  [key: string]: Icon;
}

export type IconType =
  | 'connectivity'
  | 'confirmation'
  | 'info'
  | 'warning'
  | 'error';

// cannot import from flow types, should be removed after InlineDialog conversion
export type InlineDialogPlacement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';
