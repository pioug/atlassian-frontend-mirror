import React, { Component } from 'react';
import LocaleSelect, { Locale } from '@atlaskit/locale/LocaleSelect';
import Calendar from '../src';

const log = (msg: string) => (e: any) => console.log(msg, e);

interface IntlState {
  locale: string;
}

export default class extends Component<Object, IntlState> {
  state = {
    locale: 'en-AU',
  };

  onLocaleChange = (locale: Locale) => this.setState({ locale: locale.value });

  render() {
    const { locale } = this.state;
    return (
      <div>
        <Calendar
          defaultDisabled={['2020-12-04']}
          defaultPreviouslySelected={['2020-12-06']}
          defaultSelected={['2020-12-08']}
          defaultMonth={12}
          defaultYear={2020}
          innerProps={{
            style: {
              border: '1px solid red',
              display: 'inline-block',
            },
          }}
          onBlur={() => log('blur')}
          onChange={() => log('change')}
          onFocus={() => log('focus')}
          onSelect={() => log('select')}
          locale={locale}
        />
        <LocaleSelect onLocaleChange={this.onLocaleChange} />
      </div>
    );
  }
}
