import React from 'react';

import { CustomProgressBarProps } from '../types';

import ProgressBar from './ProgressBar';

export default class TransparentProgressBar extends React.PureComponent<
  CustomProgressBarProps
> {
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
          return {
            ...theme,
            container: {
              ...theme.container,
              background: 'rgba(255, 255, 255, 0.5)',
            },
            bar: {
              ...theme.bar,
              background: 'white',
            },
          };
        }}
      />
    );
  }
}
