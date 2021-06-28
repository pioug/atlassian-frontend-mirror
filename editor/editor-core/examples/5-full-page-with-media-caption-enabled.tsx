import React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import enMessages from '../src/i18n/en';
import languages from '../src/i18n/languages';
import WithEditorActions from '../src/ui/WithEditorActions';
import {
  default as FullPageExample,
  SaveAndCancelButtons,
} from './5-full-page';
import LanguagePicker from '../example-helpers/LanguagePicker';
import { MediaOptions } from '../src';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import adf from '../example-helpers/templates/media-with-caption.adf.json';

export type Props = {};
export type State = { locale: string; messages: { [key: string]: string } };

export default class ExampleEditor extends React.Component<Props, State> {
  state: State = { locale: 'en', messages: enMessages };

  render() {
    const { locale, messages } = this.state;
    const mediaFeatureFlags: MediaFeatureFlags = {
      captions: true,
    };
    const mediaOptions: MediaOptions = {
      allowMediaSingle: true,
      featureFlags: mediaFeatureFlags,
    };

    return (
      <IntlProvider
        locale={this.getProperLanguageKey(locale)}
        messages={messages}
      >
        <FullPageExample
          defaultValue={adf}
          allowHelpDialog
          media={mediaOptions}
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
