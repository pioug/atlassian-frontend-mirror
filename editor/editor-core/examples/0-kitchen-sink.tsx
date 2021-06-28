import React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import WithEditorActions from './../src/ui/WithEditorActions';
import EditorContext from './../src/ui/EditorContext';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers/globalEventEmitterListeners';
import { KitchenSink } from '../example-helpers/kitchen-sink/kitchen-sink';
import enMessages from '../src/i18n/en';
import enData from 'react-intl/locale-data/en';

addGlobalEventEmitterListeners();
addLocaleData(enData);

export default function KitchenSinkExample() {
  const [locale, setLocale] = React.useState<string>('en');
  const [messages, setMessages] = React.useState<any>(enMessages);

  return (
    <IntlProvider locale={locale.substring(0, 2)} messages={messages}>
      <EditorContext>
        <WithEditorActions
          render={(actions) => (
            <KitchenSink
              actions={actions}
              locale={locale}
              setLocale={setLocale}
              setMessages={setMessages}
            />
          )}
        />
      </EditorContext>
    </IntlProvider>
  );
}
