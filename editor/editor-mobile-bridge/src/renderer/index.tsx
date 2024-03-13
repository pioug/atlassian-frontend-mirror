import React, { useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import MobileRenderer from './mobile-renderer-element';
import { IS_DEV } from '../utils';
import {
  createMentionProvider,
  createMediaProvider,
  createCardClient,
  createExtensionProvider,
} from '../providers';
import { createEmojiProvider } from '../providers/emojiProvider';
import type { DocNode } from '@atlaskit/adf-schema';
import { getEmptyADF } from '@atlaskit/adf-utils/empty-adf';
import { fetchProxy } from '../utils/fetch-proxy';
import getBridge from './native-to-web/bridge-initialiser';
import useRendererConfiguration from './hooks/use-renderer-configuration';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Serialized } from '../types';
import { getEnableLegacyMobileMacros } from '../query-param-reader';
import { eventHandlers } from './event-handlers';
import { handleAnalyticsEvent } from './renderer-analytics-client';

interface AppProps {
  document: DocNode;
}

const initialDocSerialized = JSON.stringify(getEmptyADF());

export const App = (props: React.PropsWithChildren<AppProps>) => {
  const content = useRef<Serialized<JSONDocNode>>('');
  const rendererBridge = getBridge();
  const rendererConfiguration = useRendererConfiguration(rendererBridge);

  const onLocaleChanged = useCallback(() => {
    rendererBridge.setContent(content.current);
  }, [rendererBridge]);

  const onWillLocaleChange = useCallback(() => {
    content.current = rendererBridge.getContent();
  }, [rendererBridge]);

  const enableConfluenceMobileMacros = getEnableLegacyMobileMacros(); // TODO: use renderer configuration instead of query params

  const [emojiProvider] = useState(() => createEmojiProvider(fetchProxy));

  return (
    <MobileRenderer
      allowAnnotations={rendererConfiguration.isAnnotationsAllowed()}
      allowHeadingAnchorLinks={rendererConfiguration.isHeadingAnchorLinksAllowed()}
      cardClient={createCardClient()}
      disableActions={rendererConfiguration.isActionsDisabled()}
      disableMediaLinking={rendererConfiguration.isMedialinkingDisabled()}
      document={props.document}
      emojiProvider={emojiProvider}
      locale={rendererConfiguration.getLocale()}
      mediaProvider={createMediaProvider()}
      mentionProvider={createMentionProvider()}
      extensionProvider={createExtensionProvider(
        enableConfluenceMobileMacros,
        handleAnalyticsEvent,
        eventHandlers?.link?.onClick,
      )}
      onLocaleChanged={onLocaleChanged}
      onWillLocaleChange={onWillLocaleChange}
      rendererBridge={rendererBridge}
      allowCustomPanels={rendererConfiguration.isCustomPanelEnabled()}
    />
  );
};

function main() {
  const params = new URLSearchParams(window.location.search);

  // Read default value from defaultValue query parameter when in development
  const rawDefaultValue = IS_DEV ? params.get('defaultValue') : null;
  const defaultValue =
    IS_DEV && rawDefaultValue
      ? JSON.parse(atob(rawDefaultValue))
      : initialDocSerialized;

  ReactDOM.render(
    <App document={defaultValue} />,
    document.getElementById('renderer'),
  );
}

window.addEventListener('DOMContentLoaded', main);
