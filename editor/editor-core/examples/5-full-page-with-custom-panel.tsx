import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { exampleDocument } from '../example-helpers/example-doc-with-custom-panels';
import LanguagePicker from '../example-helpers/LanguagePicker';
import enMessages from '../src/i18n/en';
import languages from '../src/i18n/languages';

import { default as FullPageExample } from './5-full-page';

export type Props = {};
export type State = {
  locale: string;
  messages: { [key: string]: string };
};

export default class ExampleEditor extends React.Component<Props, State> {
  state: State = { locale: 'en', messages: enMessages };

  render() {
    const { locale, messages } = this.state;

    return (
      <IntlProvider
        locale={this.getProperLanguageKey(locale)}
        messages={messages}
        key={locale}
      >
        <FullPageExample
          editorProps={{
            defaultValue: exampleDocument,
            allowHelpDialog: true,
            allowPanel: {
              allowCustomPanel: true,
              allowCustomPanelEdit: true,
            },
          }}
          customPrimaryToolbarComponents={
            <LanguagePicker
              languages={languages}
              locale={locale}
              onChange={this.loadLocale}
            />
          }
        />
      </IntlProvider>
    );
  }

  private loadLocale = async (locale: string) => {
    const messages = await Promise.all([
      // eslint-disable-next-line import/dynamic-import-chunkname
      import(`../src/i18n/${locale}`),
      // eslint-disable-next-line import/dynamic-import-chunkname
      import(`../../../elements/mention/src/i18n/${locale}`),
    ]).then((args) => ({
      ...args[0].default,
      ...args[1].default,
    }));

    this.setState({ locale, messages });
  };

  private getProperLanguageKey = (locale: string) => locale.replace('_', '-');
}
