import { type ReactNode } from 'react';

import { type CustomThemeButtonProps } from '@atlaskit/button/types';

interface Action extends Omit<CustomThemeButtonProps, 'children'> {
  key?: string;
  text?: ReactNode;
}

export type Actions = Action[];
