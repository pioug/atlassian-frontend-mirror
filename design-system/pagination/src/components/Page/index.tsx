import React, { Component } from 'react';

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

export default class Page extends Component<PagePropsType> {
  render() {
    return <CustomThemeButton {...this.props} appearance="subtle" />;
  }
}
