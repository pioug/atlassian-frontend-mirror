import React, { Component, Fragment } from 'react';
import TextField from '@atlaskit/textfield';
import { Label } from '@atlaskit/field-base';

import { LocalizationProvider, createLocalizationProvider } from '../src';
import LocaleSelect, { Locale } from '../src/LocaleSelect';

type State = {
  l10n: LocalizationProvider;
  dateInput: string;
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
      dateInput: '',
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
    this.setState({
      l10n: createLocalizationProvider(locale.value),
    });
  };

  onInputChange = (event: any) => {
    this.setState({
      dateInput: event.target.value,
    });
  };

  render() {
    const l10n = this.props.l10n || this.state.l10n;

    const { dateInput, now } = this.state;
    const parsedDate = l10n.parseDate(dateInput);
    const parsedDateISO = isNaN(parsedDate.getDate())
      ? parsedDate.toString()
      : parsedDate.toISOString();
    return (
      <Fragment>
        <h3>Date Parser</h3>
        <Label label="Input" />
        <TextField
          value={dateInput}
          onChange={this.onInputChange}
          placeholder={l10n.formatDate(now)}
        />
        <Label label="Output" />
        <TextField value={parsedDateISO} isReadOnly isDisabled />

        {this.props.l10n ? undefined : (
          <LocaleSelect onLocaleChange={this.onLocaleChange} />
        )}
      </Fragment>
    );
  }
}
