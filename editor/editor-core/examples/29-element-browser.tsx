/** @jsx jsx */
import { useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import {
  IntlProvider,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl-next';
import {
  AnalyticsEventPayload,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import ElementBrowser from '../src/ui/ElementBrowser';
import { getCategories } from '../src/ui/ElementBrowser/categories';
import { useDefaultQuickInsertGetItems } from '../example-helpers/use-default-quickinsert-get-items';

export default () => {
  const getItems = useDefaultQuickInsertGetItems();
  const handleAnalytics = useCallback((event: AnalyticsEventPayload) => {
    console.groupCollapsed('gasv3 event:', event.payload.action);
    console.log(event.payload);
    console.groupEnd();
  }, []);

  return (
    <AnalyticsListener channel="editor" onEvent={handleAnalytics}>
      <IntlProvider locale="en">
        <ElementBrowserWithIntl getItems={getItems} />
      </IntlProvider>
    </AnalyticsListener>
  );
};

const RenderElementBrowser = (
  props: {
    getItems: (query?: string, category?: string) => QuickInsertItem[];
  } & WrappedComponentProps,
) => (
  <div css={wrapper}>
    <ElementBrowser
      categories={getCategories(props.intl)}
      getItems={props.getItems}
      showSearch={true}
      showCategories={true}
      mode="full"
      defaultCategory="all"
      onInsertItem={onInsertItem}
    />
  </div>
);

const wrapper = css`
  display: flex;
  height: 100%;
`;

const onInsertItem = (item: QuickInsertItem) => {
  console.log('Inserting item ', item);
};

const ElementBrowserWithIntl = injectIntl(RenderElementBrowser);
