import React, { PureComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import memoizeOne from 'memoize-one';
import { isElectronMacKey } from './util';

const getTheme = memoizeOne(isElectronMac => ({
  [isElectronMacKey]: isElectronMac,
}));

export default class WithElectronTheme extends PureComponent {
  static defaultProps = {
    isElectronMac: false,
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const theme = getTheme(this.props.isElectronMac);
    return <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>;
  }
}
