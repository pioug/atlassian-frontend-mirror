import React from 'react';

import { IntlProvider } from 'react-intl-next';

import type { MediaOptions } from '@atlaskit/editor-plugins/media/types';

import { getTranslations } from '../example-helpers/get-translations';
import LanguagePicker from '../example-helpers/LanguagePicker';
import adf from '../example-helpers/templates/media-without-caption.adf.json';
import enMessages from '../src/i18n/en';
import languages from '../src/i18n/languages';
import WithEditorActions from '../src/ui/WithEditorActions';

import {
  default as FullPageExample,
  SaveAndCancelButtons,
} from './5-full-page';

export type Props = {};
export type State = { locale: string; messages: { [key: string]: string } };
export default class ExampleEditor extends React.Component<Props, State> {
  state: State = { locale: 'en', messages: enMessages };
  render() {
    const { locale, messages } = this.state;

    const mediaOptions: MediaOptions = {
      allowMediaSingle: true,
      allowCaptions: false,
    };
    return (
      <IntlProvider
        locale={this.getProperLanguageKey(locale)}
        messages={messages}
      >
        <FullPageExample
          editorProps={{
            defaultValue: adf,
            allowHelpDialog: true,
            media: mediaOptions,
            primaryToolbarComponents: (
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
            ),
          }}
        />
      </IntlProvider>
    );
  }
  private loadLocale = async (locale: string) => {
    const messages = await getTranslations(locale);
    this.setState({ locale, messages });
  };
  private getProperLanguageKey = (locale: string) => locale.replace('_', '-');
}
