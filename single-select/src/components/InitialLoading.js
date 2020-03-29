import React, { PureComponent } from 'react';

import InitialLoadingElement from '../styled/InitialLoading';

export default class InitialLoading extends PureComponent {
  render() {
    return (
      <InitialLoadingElement aria-live="polite" role="status">
        {this.props.children}
      </InitialLoadingElement>
    );
  }
}
