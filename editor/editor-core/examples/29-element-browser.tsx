import React, { useCallback } from 'react';
import {
  AnalyticsEventPayload,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
import EditorActions from '../src/actions';
import ElementBrowser from '../src/ui/ElementBrowser';
import { extensionProviderToQuickInsertProvider } from '../src/utils/extensions';
import { getConfluenceMacrosExtensionProvider } from '../example-helpers/confluence-macros';

export default () => {
  const quickInsertProvider = extensionProviderToQuickInsertProvider(
    getConfluenceMacrosExtensionProvider({} as EditorActions),
    {} as EditorActions,
  );
  const handleAnalytics = useCallback((event: AnalyticsEventPayload) => {
    console.groupCollapsed('gasv3 event:', event.payload.action);
    console.log(event.payload);
    console.groupEnd();
  }, []);
  return (
    <AnalyticsListener channel="editor" onEvent={handleAnalytics}>
      <ElementBrowser
        quickInsertProvider={quickInsertProvider}
        showSearch={true}
        showCategories={true}
        mode="full"
      />
    </AnalyticsListener>
  );
};
