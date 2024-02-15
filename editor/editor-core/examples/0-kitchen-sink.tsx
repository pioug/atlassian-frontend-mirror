import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers/globalEventEmitterListeners';

import { DevTools } from '../example-helpers/DevTools';
import { KitchenSink } from '../example-helpers/kitchen-sink/kitchen-sink';
import enMessages from '../src/i18n/en';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';

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
