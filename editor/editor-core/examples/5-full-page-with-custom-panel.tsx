import React, { ChangeEvent } from 'react';
import { IntlProvider } from 'react-intl-next';
import enMessages from '../src/i18n/en';
import languages from '../src/i18n/languages';
import { default as FullPageExample } from './5-full-page';
import LanguagePicker from '../example-helpers/LanguagePicker';
import { exampleDocument } from '../example-helpers/example-doc-with-custom-panels';
import { ThemeProvider as StyledThemeProvider } from '@emotion/react';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
import type { ThemeModes } from '@atlaskit/theme/types';

export type Props = {};
export type State = {
  locale: string;
  messages: { [key: string]: string };
  theme: ThemeModes;
};

const LIGHT_THEME = 'light',
  DARK_THEME = 'dark';

export default class ExampleEditor extends React.Component<Props, State> {
  state: State = { locale: 'en', messages: enMessages, theme: LIGHT_THEME };

  render() {
    const { locale, messages, theme } = this.state;

    const onThemeToggle = (event: ChangeEvent<HTMLInputElement>) => {
      this.setState({
        theme: event.currentTarget.checked ? DARK_THEME : LIGHT_THEME,
      });
    };

    const toggleDarkMode = (
      <label>
        <input
          type="checkbox"
          onChange={onThemeToggle}
          checked={theme === 'dark'}
        />
        Dark Mode
      </label>
    );

    return (
      <IntlProvider
        locale={this.getProperLanguageKey(locale)}
        messages={messages}
        key={locale}
      >
        <DeprecatedThemeProvider mode={theme} provider={StyledThemeProvider}>
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
          {toggleDarkMode}
        </DeprecatedThemeProvider>
      </IntlProvider>
    );
  }

  private loadLocale = async (locale: string) => {
    const messages = await Promise.all([
      // eslint-disable-next-line import/dynamic-import-chunkname
      import(`../src/i18n/${locale}`),
      // eslint-disable-next-line import/dynamic-import-chunkname
      import(`@atlaskit/mention/src/i18n/${locale}`),
    ]).then((args) => ({
      ...args[0].default,
      ...args[1].default,
    }));

    this.setState({ locale, messages });
  };

  private getProperLanguageKey = (locale: string) => locale.replace('_', '-');
}
