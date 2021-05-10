import React from 'react';

import {
  Appearance,
  CustomThemeButton,
  CustomThemeButtonProps,
} from '@atlaskit/button';

type Diff<T, U> = T extends U ? never : T;

type PagePropsType = Diff<
  CustomThemeButtonProps,
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
  return <CustomThemeButton {...props} appearance="subtle" />;
}
