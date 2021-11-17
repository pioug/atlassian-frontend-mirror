import React, { ChangeEvent } from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import enMessages from '../src/i18n/en';
import languages from '../src/i18n/languages';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  default as FullPageExample,
  SaveAndCancelButtons,
} from './5-full-page';
import LanguagePicker from '../example-helpers/LanguagePicker';
import { exampleDocument } from '../example-helpers/example-doc-with-custom-panels';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ThemeModes } from '@atlaskit/theme';

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
            defaultValue={exampleDocument}
            allowHelpDialog
            allowPanel={{ allowCustomPanel: true, allowCustomPanelEdit: true }}
            primaryToolbarComponents={
              <WithEditorActions
                render={(actions) => (
                  <React.Fragment>
                    <LanguagePicker
                      languages={languages}
                      locale={locale}
                      onChange={this.loadLocale}
                    />
                    <SaveAndCancelButtons editorActions={actions} />
                  </React.Fragment>
                )}
              />
            }
          />
          {toggleDarkMode}
        </DeprecatedThemeProvider>
      </IntlProvider>
    );
  }

  private loadLocale = async (locale: string) => {
    const localeData = await import(
      `react-intl/locale-data/${this.getLocalTag(locale)}`
    );
    addLocaleData(localeData.default);

    const messages = await Promise.all([
      import(`../src/i18n/${locale}`),
      import(`@atlaskit/mention/src/i18n/${locale}`),
    ]).then((args) => ({
      ...args[0].default,
      ...args[1].default,
    }));

    this.setState({ locale, messages });
  };

  private getLocalTag = (locale: string) => locale.substring(0, 2);
  private getProperLanguageKey = (locale: string) => locale.replace('_', '-');
}
