import React, { Component } from 'react';

import { styleReducerNoOp, withContentTheme } from '../../../theme';

import SectionBase from './Section';

const SectionWithTheme = withContentTheme(SectionBase);

export default class Section extends Component {
  static defaultProps = {
    alwaysShowScrollHint: false,
    shouldGrow: false,
    styles: styleReducerNoOp,
  };

  render() {
    return <SectionWithTheme {...this.props} />;
  }
}
