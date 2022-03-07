import React from 'react';

import deprecationWarning from '@atlaskit/ds-lib/deprecation-warning';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { CustomProgressBarProps } from '../types';

import ProgressBar from './progress-bar';

export default class SuccessProgressBar extends React.PureComponent<
  CustomProgressBarProps
> {
  static defaultProps = {
    value: 0,
    isIndeterminate: false,
  };

  render() {
    deprecationWarning(
      '@atlaskit/progress-bar',
      '`theme` prop',
      'If you depend on `theme`, we recommend migrating to one of its variants.',
    );

    return (
      <ProgressBar
        {...this.props}
        theme={(currentTheme, props) => {
          const theme = currentTheme(props);
          const { value, isIndeterminate } = this.props;
          if (value < 1 || isIndeterminate) {
            return theme;
          }
          return {
            ...theme,
            bar: {
              ...theme.bar,
              background: token('color.background.success.bold', G300),
            },
          };
        }}
      />
    );
  }
}
