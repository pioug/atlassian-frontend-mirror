import React from 'react';
import { IntlProvider } from 'react-intl-next';
import WithEditorActions from './../src/ui/WithEditorActions';
import EditorContext from './../src/ui/EditorContext';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers/globalEventEmitterListeners';
import { KitchenSink } from '../example-helpers/kitchen-sink/kitchen-sink';
import { DevTools } from '../example-helpers/DevTools';
import enMessages from '../src/i18n/en';

addGlobalEventEmitterListeners();

export default function KitchenSinkExample() {
  const [locale, setLocale] = React.useState<string>('en');
  const [messages, setMessages] = React.useState<any>(enMessages);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <EditorContext>
        <DevTools />
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
