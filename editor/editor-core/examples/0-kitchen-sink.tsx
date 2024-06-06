import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { DevTools } from '@af/editor-examples-helpers/utils';
import { KitchenSink } from '@af/editor-examples-helpers/utils';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers/globalEventEmitterListeners';

import enMessages from '../src/i18n/en';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';

addGlobalEventEmitterListeners();

const getProperLanguageKey = (locale: string) => locale.replace('_', '-');

export default function KitchenSinkExample() {
	const [locale, setLocale] = React.useState<string>('en');
	const [messages, setMessages] = React.useState<any>(enMessages);
	//console.log('KitchenSinkExample', locale);


	return (
		<IntlProvider locale={getProperLanguageKey(locale)} messages={messages}>
			<EditorContext>
				<WithEditorActions
					render={(actions) => (
						<React.Fragment>
							<DevTools editorView={actions._privateGetEditorView()} />
              <KitchenSink
								actions={actions}
								locale={locale}
								setLocale={setLocale}
								setMessages={setMessages}
							/>
						</React.Fragment>
					)}
				/>
			</EditorContext>
		</IntlProvider>
	);
}
