import React from 'react';

import { IntlProvider, intlShape } from 'react-intl';

export class IntlLegacyFallbackProvider extends React.Component {
  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const oldIntl = this.context.intl;
    if (!oldIntl) {
      return <IntlProvider locale="en">{this.props.children}</IntlProvider>;
    }
    return this.props.children;
  }
}
