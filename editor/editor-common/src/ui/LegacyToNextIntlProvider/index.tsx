import React from 'react';

import { intlShape } from 'react-intl';
import { createIntl, RawIntlProvider } from 'react-intl-next';

export class LegacyToNextIntlProvider extends React.Component {
  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const oldIntl = this.context.intl;
    if (oldIntl) {
      const nextIntl = createIntl({
        ...oldIntl,
      });
      return (
        <RawIntlProvider value={nextIntl}>
          {this.props.children}
        </RawIntlProvider>
      );
    }
    return this.props.children;
  }
}
