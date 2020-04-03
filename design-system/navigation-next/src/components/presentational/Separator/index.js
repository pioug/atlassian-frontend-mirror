import React, { Component } from 'react';

import { withContentTheme } from '../../../theme';

const SeparatorWithTheme = withContentTheme(({ theme }) => {
  const { mode, context } = theme;
  const styles = mode.separator()[context];
  return <div css={styles} />;
});

export default class Separator extends Component {
  render() {
    return <SeparatorWithTheme />;
  }
}
