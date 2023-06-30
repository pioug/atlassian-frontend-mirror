import React, { useState } from 'react';

import { MockLinkPickerPromisePlugin } from '@atlaskit/link-test-helpers/link-picker';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';
import { LinkSearchListItemData } from '../src/common/types';

const icon =
  'data:image/png;base64,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';

const tab1data: LinkSearchListItemData[] = [
  {
    objectId:
      'ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/20505',
    url: 'https://product-fabric.atlassian.net/browse/FAB-1520',
    name: "FAB-1520 UI: Poor man's search",
    container: 'Fabric',
    icon,
    iconAlt: 'test',
    lastViewedDate: new Date('2016-11-25T05:21:01.112Z'),
    meta: {
      source: 'recent-work',
    },
  },
  {
    objectId:
      'ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/20617',
    url: 'https://product-fabric.atlassian.net/browse/FAB-1558',
    name: 'FAB-1558 Investigate the 25% empty experience problem',
    container: 'Fabric',
    icon,
    iconAlt: 'test',
    lastViewedDate: new Date('2016-11-24T23:55:20.712Z'),
    meta: {
      source: 'xp-search',
    },
  },
  {
    objectId:
      'ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/18347',
    url: 'https://product-fabric.atlassian.net/browse/FAB-983',
    name: 'FAB-983 P2 Integration plugin: do not cache Cloud ID in Vertigo world',
    container: 'Fabric',
    icon,
    iconAlt: 'test',
    lastViewedDate: new Date('2016-11-24T23:30:54.633Z'),
    meta: {
      source: 'recent-work',
    },
  },
];
const tab2data: LinkSearchListItemData[] = [
  {
    objectId:
      'ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/18361',
    url: 'https://product-fabric.atlassian.net/browse/FAB-997',
    name: 'FAB-997 Investigate replacing experiment with navlinks plugin',
    container: 'Fabric',
    icon,
    iconAlt: 'test',
    lastViewedDate: new Date('2016-11-24T23:29:08.924Z'),
    meta: {
      source: 'xp-search',
    },
  },
  {
    objectId:
      'ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/19087',
    url: 'https://product-fabric.atlassian.net/browse/FAB-1166',
    name: 'FAB-1166 Heading disable rules',
    container: 'Fabric',
    icon,
    iconAlt: 'test',
    lastViewedDate: new Date('2016-11-24T05:54:44.729Z'),
    meta: {
      source: 'recent-work',
    },
  },
  {
    objectId:
      'ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/19018',
    url: 'https://product-fabric.atlassian.net/browse/FAB-1097',
    name: 'FAB-1097 Inline code disable rules',
    container: 'Fabric',
    icon,
    iconAlt: 'test',
    lastViewedDate: new Date('2016-11-24T05:54:39.227Z'),
    meta: {
      source: 'xp-search',
    },
  },
];
const defaultPlugins = [
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab1',
    tabTitle: 'Confluence',
    promise: Promise.resolve(tab1data),
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab2',
    tabTitle: 'Bitbucket',
    promise: Promise.resolve(tab2data),
  }),
];

export default function VrMultiplePlugins() {
  const [plugins, setPlugins] = useState(defaultPlugins);
  return (
    <PageWrapper>
      <button
        data-test-id="add-tab"
        onClick={() => {
          setPlugins([
            ...plugins,
            new MockLinkPickerPromisePlugin({
              tabKey: 'tab11',
              tabTitle: 'Another tab',
            }),
          ]);
        }}
      >
        add tab
      </button>
      <LinkPicker
        plugins={plugins}
        onSubmit={() => {}}
        onCancel={() => {}}
        featureFlags={{ scrollingTabs: true }}
      />
    </PageWrapper>
  );
}
