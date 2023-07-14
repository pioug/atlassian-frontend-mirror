import React, { Component, Fragment } from 'react';

import { LocalizationProvider, createLocalizationProvider } from '../src';
import LocaleSelect, { Locale } from '../src/LocaleSelect';

import DateParserExample from './1-date-parser';
import FormatDateExample from './2-format-date';
import FormatTimeExample from './3-format-time';
import ShortDaysExample from './4-short-days';
import LongMonthsExample from './5-long-months';

type State = {
  l10n: LocalizationProvider;
};

export default class Example extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      l10n: createLocalizationProvider('en-AU'),
    };
  }

  onLocaleChange = (locale: Locale) => {
    this.setState({
      l10n: createLocalizationProvider(locale.value),
    });
  };

  render() {
    const { l10n } = this.state;

    return (
      <Fragment>
        <h3>Locale</h3>
        <LocaleSelect onLocaleChange={this.onLocaleChange} />

        <DateParserExample l10n={l10n} />
        <FormatDateExample l10n={l10n} />
        <FormatTimeExample l10n={l10n} />
        <ShortDaysExample l10n={l10n} />
        <LongMonthsExample l10n={l10n} />
      </Fragment>
    );
  }
}
