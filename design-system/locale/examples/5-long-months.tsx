import React, { Component, Fragment } from 'react';

import { LocalizationProvider, createLocalizationProvider } from '../src';
import LocaleSelect, { Locale } from '../src/LocaleSelect';

type State = {
  l10n: LocalizationProvider;
};

type Props = {
  l10n?: LocalizationProvider;
};

export default class Example extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.interval = -1;
    this.state = {
      l10n: props.l10n || createLocalizationProvider('en-AU'),
    };
  }

  interval: number;

  onLocaleChange = (locale: Locale) => {
    this.setState({
      l10n: createLocalizationProvider(locale.value),
    });
  };

  render() {
    const l10n = this.props.l10n || this.state.l10n;
    return (
      <Fragment>
        <h3>Long Months</h3>
        <ul>
          {l10n.getMonthsLong().map((month) => (
            <li key={month}>{month}</li>
          ))}
        </ul>

        {this.props.l10n ? undefined : (
          <LocaleSelect onLocaleChange={this.onLocaleChange} />
        )}
      </Fragment>
    );
  }
}
