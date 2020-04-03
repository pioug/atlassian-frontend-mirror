import React from 'react';
import { ButtonProps } from '@atlaskit/button';

export type KeyboardOrMouseEvent =
  | React.MouseEvent<any>
  | React.KeyboardEvent<any>;
export type AppearanceType = 'danger' | 'warning';

export type ActionProps = ButtonProps & { text: string };
