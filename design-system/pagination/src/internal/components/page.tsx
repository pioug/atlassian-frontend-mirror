import React from 'react';

import Button, { type ButtonProps } from '@atlaskit/button/standard-button';
import type { Appearance } from '@atlaskit/button/types';

type Diff<T, U> = T extends U ? never : T;

type PageProps = Diff<
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

export default function Page(props: PageProps) {
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  return <Button {...props} appearance="subtle" />;
}
