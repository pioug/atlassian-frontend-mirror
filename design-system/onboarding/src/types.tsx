import { ReactNode } from 'react';

import { ButtonProps } from '@atlaskit/button';

interface Action extends Omit<ButtonProps, 'children'> {
  key?: string;
  text?: ReactNode;
}

export type Actions = Action[];
