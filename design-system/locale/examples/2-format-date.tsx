import React, { Component, Fragment } from 'react';

import { Label } from '@atlaskit/form';

import { LocalizationProvider, createLocalizationProvider } from '../src';
import LocaleSelect, { Locale } from '../src/LocaleSelect';

type State = {
  l10n: LocalizationProvider;
  now: Date;
};

type Props = {
  l10n?: LocalizationProvider;
};

export default class Example extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      l10n: props.l10n || createLocalizationProvider('en-AU'),
      now: new Date(),
    };
  }

  interval = -1;

  componentDidMount() {
    this.interval = window.setInterval(
      () =>
        this.setState({
          now: new Date(),
        }),
      1000,
    );
  }

  componentWillUnmount(): void {
    window.clearInterval(this.interval);
  }

  onLocaleChange = (locale: Locale) => {
    const { l10n } = this.props;
    if (!l10n) {
      this.setState({
        l10n: createLocalizationProvider(locale.value),
      });
    }
  };

  render() {
    const l10n = this.props.l10n || this.state.l10n;
    const { now } = this.state;
    return (
      <Fragment>
        <h2>Date Formatter</h2>
        <p>{l10n.formatDate(now)}</p>

        {this.props.l10n ? undefined : (
          <>
            <Label htmlFor="locale">Locale</Label>
            <LocaleSelect id="locale" onLocaleChange={this.onLocaleChange} />
          </>
        )}
      </Fragment>
    );
  }
}
