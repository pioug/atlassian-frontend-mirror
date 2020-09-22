import React from 'react';

import { CustomThemeButtonProps } from '@atlaskit/button/types';

export type KeyboardOrMouseEvent =
  | React.MouseEvent<any>
  | React.KeyboardEvent<any>;
export type AppearanceType = 'danger' | 'warning';

export type ScrollBehavior = 'inside' | 'outside' | 'inside-wide';

export type ActionProps = CustomThemeButtonProps & {
  // ReactNode provides support for i18n libraries
  text: React.ReactNode;
};

export interface ContainerComponentProps {
  className?: string;
  ['data-testid']?: string;
  children?: React.ReactNode;
}
