import React, { useCallback } from 'react';
import {
  AnalyticsEventPayload,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
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

  const onSelectItem = useCallback((item: QuickInsertItem) => {
    console.log('selected item ', item);
  }, []);
  return (
    <AnalyticsListener channel="editor" onEvent={handleAnalytics}>
      <ElementBrowser
        categories={categoriesList}
        quickInsertProvider={quickInsertProvider}
        showSearch={true}
        showCategories={true}
        mode="full"
        defaultCategory="all"
        onSelectItem={onSelectItem}
      />
    </AnalyticsListener>
  );
};

const categoriesList = [
  { title: 'All', name: 'all' },
  { title: 'Formatting', name: 'formatting' },
  { title: 'Confluence content', name: 'confluence-content' },
  { title: 'Media', name: 'media' },
  { title: 'Visuals & images', name: 'visuals' },
  { title: 'Navigation', name: 'navigation' },
  { title: 'External content', name: 'external-content' },
  { title: 'Communication', name: 'communication' },
  { title: 'Reporting', name: 'reporting' },
  { title: 'Administration', name: 'admin' },
  { title: 'Development', name: 'development' },
];
