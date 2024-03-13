import '@babel/polyfill';
import { tempPolyfills } from './polyfills';
tempPolyfills();
import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import MobileEditor from './mobile-editor-element';
import { IS_DEV } from '../utils';
import { getQueryParams } from '../query-param-reader';
import { ErrorBoundary } from './error-boundary';
import { toNativeBridge } from './web-to-native';
import { getBridge } from './native-to-web/bridge-initialiser';
import { useEditorConfiguration } from './hooks/use-editor-configuration';
import { useRemountKey } from './hooks/use-remount-key';
import { useProviders } from './hooks/use-providers';

interface AppProps {
  defaultValue?: Node | string | Object;
}

export const App = (props: React.PropsWithChildren<AppProps>) => {
  const isIOS = !!window.webkit;
  if (isIOS) {
    return (
      <div style={{ minHeight: '46px' }}>
        <Editor defaultValue={props.defaultValue}></Editor>
      </div>
    );
  }
  return <Editor defaultValue={props.defaultValue}></Editor>;
};

const Editor = (props: React.PropsWithChildren<AppProps>) => {
  const bridge = getBridge();
  const editorConfiguration = useEditorConfiguration(bridge);

  const {
    providers: {
      mentionProvider,
      emojiProvider,
      mediaProvider,
      cardProvider,
      cardClient,
      createCollabProvider,
    },
    resetProviders,
  } = useProviders();

  useEffect(() => {
    bridge.setResetProviders(resetProviders);
  }, [bridge, resetProviders]);

  const onLocaleChanged = useCallback(() => {
    bridge.restoreContent();
  }, [bridge]);

  const appearanceMode = editorConfiguration.getEditorAppearance();
  const locale = editorConfiguration.getLocale();
  const remountKey = useRemountKey(appearanceMode, locale);

  useEffect(() => {
    bridge.restoreContent();
  }, [bridge, remountKey]);

  return (
    <ErrorBoundary>
      <MobileEditor
        // [ED-14955] Use `remountKey` to reconstruct schema when switching
        // between appearance modes (e.g., full, compact)
        key={remountKey}
        defaultValue={props.defaultValue}
        bridge={bridge}
        locale={locale}
        editorConfiguration={editorConfiguration}
        onLocaleChanged={onLocaleChanged}
        mentionProvider={mentionProvider}
        emojiProvider={emojiProvider}
        mediaProvider={mediaProvider}
        cardProvider={cardProvider}
        cardClient={cardClient}
        createCollabProvider={createCollabProvider}
      />
    </ErrorBoundary>
  );
};

function main() {
  // Read default value from defaultValue query parameter when in development
  const rawDefaultValue = IS_DEV ? getQueryParams().get('defaultValue') : null;
  const defaultValue =
    IS_DEV && rawDefaultValue ? atob(rawDefaultValue) : undefined;

  if (toNativeBridge.startWebBundle) {
    toNativeBridge.startWebBundle();
  }

  ReactDOM.render(
    <App defaultValue={defaultValue} />,
    document.getElementById('editor'),
  );
}

window.addEventListener('DOMContentLoaded', main);
