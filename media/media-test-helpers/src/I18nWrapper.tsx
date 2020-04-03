import React from 'react';
import { Component, ReactElement } from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import { locales, languages } from '@atlaskit/media-ui';
import LanguagePicker from './LanguagePicker';
import * as es from 'react-intl/locale-data/es';

addLocaleData(es);

// Using it to show only the messages with i18 integrated
const enabledLanguages = {
  en: languages.en,
  es: languages.es,
};
export interface I18NWrapperState {
  locale: string;
}

export interface I18NWrapperProps {
  children: ReactElement<any>;
}

export class I18NWrapper extends Component<I18NWrapperProps, I18NWrapperState> {
  state: I18NWrapperState = {
    locale: 'en',
  };

  onLocaleChange = (option: any) => {
    this.setState({
      locale: option.value,
    });
  };

  render() {
    const { children } = this.props;
    const { locale } = this.state;
    // We need to clone the element and pass a the locale prop to force a re render
    const childrenWithLocale = React.cloneElement(children, { locale });

    return (
      <IntlProvider
        locale={this.getLocalTag(locale)}
        messages={locales[locale]}
      >
        <div style={{ paddingTop: '40px' }}>
          <p>
            Use the Select to move between "English" and "Spanish", click in the
            "Show Popup" to check the i18 integration.
          </p>
          <LanguagePicker
            languages={enabledLanguages}
            locale={locale}
            onChange={this.loadLocale}
          />
          {childrenWithLocale}
        </div>
      </IntlProvider>
    );
  }

  private loadLocale = async (locale: string) => {
    this.setState({ locale });
  };

  private getLocalTag = (locale: string) => locale.substring(0, 2);
}
