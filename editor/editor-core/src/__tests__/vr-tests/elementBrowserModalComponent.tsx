import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { ElementBrowser } from '@atlaskit/editor-common/element-browser';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import { getCategories } from '../../../example-helpers/quick-insert-categories';
import { default as EditorContext } from '../../ui/EditorContext';

const RenderElementBrowser = (
  props: {
    getItems: (query?: string, category?: string) => QuickInsertItem[];
  } & WrappedComponentProps,
) => (
  <div style={{ display: 'flex', height: '150px' }}>
    <ElementBrowser
      categories={getCategories(props.intl)}
      getItems={props.getItems}
      showSearch={true}
      showCategories={true}
      mode="full"
      defaultCategory="all"
      onInsertItem={() => {}}
    />
  </div>
);

const ElementBrowserWithIntl = injectIntl(RenderElementBrowser);

const ElementBrowserComp = () => {
  const getItems: () => QuickInsertItem[] = () => [
    {
      name: 'item-1',
      title: 'Item 1',
      action: () => false,
      categories: ['category-2'],
    },
    {
      name: 'item-2',
      title: 'Item 2',
      action: () => false,
      categories: ['category-3'],
    },
    {
      name: 'item-3',
      title: 'Item 3',
      action: () => false,
      categories: ['category-3'],
    },
    {
      name: 'item-4',
      title: 'Item 4',
      action: () => false,
      categories: ['category-3'],
    },
  ];

  return <ElementBrowserWithIntl getItems={getItems} />;
};
export default () => (
  <div>
    <EditorContext>
      <ElementBrowserComp />
    </EditorContext>
  </div>
);
