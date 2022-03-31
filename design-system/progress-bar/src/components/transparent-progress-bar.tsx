import React from 'react';

import deprecationWarning from '@atlaskit/ds-lib/deprecation-warning';
import { token } from '@atlaskit/tokens';

import { CustomProgressBarProps } from '../types';

import ProgressBar from './progress-bar';

export default class TransparentProgressBar extends React.PureComponent<
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
          return {
            ...theme,
            container: {
              ...theme.container,
              background: token(
                'color.background.inverse.subtle',
                'rgba(255, 255, 255, 0.5)',
              ),
            },
            bar: {
              ...theme.bar,
              background: token('elevation.surface', 'white'),
            },
          };
        }}
      />
    );
  }
}
