import React from 'react';
import { colors } from '@atlaskit/theme';
import ProgressBar from './ProgressBar';
import { CustomProgressBarProps } from '../types';

export default class extends React.PureComponent<CustomProgressBarProps> {
  static defaultProps = {
    value: 0,
    isIndeterminate: false,
  };

  render() {
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
              background: colors.G300,
            },
          };
        }}
      />
    );
  }
}
