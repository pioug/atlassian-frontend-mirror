import React, { useState } from 'react';
import { MockLinkPickerPromisePlugin } from '@atlaskit/link-test-helpers/link-picker';

import { LinkPicker } from '../src';
import { PageWrapper } from '../example-helpers/common';
import { LinkSearchListItemData } from '@atlaskit/link-picker';

const tab1data: LinkSearchListItemData[] = [
  {
    objectId:
      'ari:cloud:jira:DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b:issue/20505',
    url: 'https://product-fabric.atlassian.net/browse/FAB-1520',
    name: "FAB-1520 UI: Poor man's search",
    container: 'Fabric',
    icon: 'https://hello.atlassian.net/secure/viewavatar?size=medium&avatarId=35551&avatarType=issuetype',
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
    icon: 'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg',
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
    icon: 'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype',
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
    icon: 'https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg',
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
    icon: 'https://product-fabric.atlassian.net/images/icons/issuetypes/epic.svg',
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
    icon: 'https://product-fabric.atlassian.net/images/icons/issuetypes/epic.svg',
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
