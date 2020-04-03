import React, { Component } from 'react';
import Button, { ButtonProps, ButtonAppearances } from '@atlaskit/button';

type Diff<T, U> = T extends U ? never : T;

type PagePropsType = Diff<
  ButtonProps,
  {
    appearance?: ButtonAppearances;
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
    return <Button {...this.props} appearance="subtle" />;
  }
}
