import React from 'react';

import Button, { ButtonProps } from '@atlaskit/button/standard-button';
import type { Appearance } from '@atlaskit/button/types';

type Diff<T, U> = T extends U ? never : T;

type PagePropsType = Diff<
  ButtonProps,
  {
    appearance?: Appearance;
    autoFocus: boolean;
    isDisabled: boolean;
    isLoading: boolean;
    spacing: 'compact' | 'default' | 'none';
    shouldFitContainer: boolean;
    type: 'button' | 'submit';
  }
> & { page?: any };

export default function Page(props: PagePropsType) {
  return <Button {...props} appearance="subtle" />;
}
