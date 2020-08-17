import React, { useCallback } from 'react';
import { IntlProvider } from 'react-intl';
import {
  AnalyticsEventPayload,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { useStateFromPromise } from '../src/utils/react-hooks/use-state-from-promise';
import EditorActions from '../src/actions';
import ElementBrowser from '../src/ui/ElementBrowser';
import { extensionProviderToQuickInsertProvider } from '../src/utils/extensions';
import { getConfluenceMacrosExtensionProvider } from '../example-helpers/confluence-macros';
import { searchQuickInsertItems } from '../src/plugins/quick-insert/search';

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

  const [items] = useStateFromPromise<QuickInsertItem[]>(
    () => quickInsertProvider.then(provider => provider.getItems()),
    [quickInsertProvider],
    [],
  );

  const getItems = useCallback(
    (query?: string, category?: string) =>
      searchQuickInsertItems(
        {
          isElementBrowserModalOpen: true,
          lazyDefaultItems: () => items || [],
        },
        {},
      )(query, category),
    [items],
  );

  return (
    <AnalyticsListener channel="editor" onEvent={handleAnalytics}>
      <IntlProvider locale={'en'}>
        <ElementBrowser
          categories={categoriesList}
          getItems={getItems}
          showSearch={true}
          showCategories={true}
          mode="full"
          defaultCategory="all"
          onSelectItem={onSelectItem}
        />
      </IntlProvider>
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
