import React, { SyntheticEvent, useState, useMemo } from 'react';

import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

import {
  AtlassianLinkPickerPlugin,
  Scope,
} from '@atlassian/link-picker-atlassian-plugin';
import { useForgeSearchProviders } from '@atlassian/link-picker-plugins';
import { mockEndpoints as mockRecentsEndPoints } from '@atlassian/recent-work-client/mocks';

import { LinkPicker, LinkPickerProps } from '../src';
import { PageHeader, PageWrapper } from '../example-helpers/common';
import { mockPluginEndpoints } from '../example-helpers/mock-plugin-endpoints';
import mockRecentData from '../example-helpers/mock-recents-data';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

const smartCardClient = new CardClient('staging');

mockPluginEndpoints();
mockRecentsEndPoints(undefined, undefined, mockRecentData);

function ForgePlugins() {
  const [link, setLink] = useState<OnSubmitPayload>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });
  const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(true);
  const linkAnalytics = useSmartLinkLifecycleAnalytics();

  const handleSubmit: LinkPickerProps['onSubmit'] = (payload, analytic) => {
    setLink(payload);
    linkAnalytics.linkCreated(payload, analytic);
    setIsLinkPickerVisible(false);
  };

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLinkPickerVisible(true);
  };

  const handleCancel = () => setIsLinkPickerVisible(false);

  const forgePlugins = useForgeSearchProviders();
  const plugins = useMemo(
    () => [
      new AtlassianLinkPickerPlugin({
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        scope: Scope.ConfluencePageBlog,
        aggregatorUrl:
          'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
        activityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',
      }),
      ...forgePlugins,
    ],
    [forgePlugins],
  );

  const linkPicker = isLinkPickerVisible && (
    <LinkPicker
      plugins={plugins}
      url={link.url}
      displayText={link.displayText}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );

  return (
    <PageWrapper>
      <PageHeader>
        <p>
          Integration with <b>link-picker-atlassian-plugin</b> and{' '}
          <b>link-picker-plugins</b>.
        </p>
      </PageHeader>
      <div style={{ paddingBottom: 20 }}>
        <a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
          {link.displayText || link.url}
        </a>
      </div>
      {linkPicker}
    </PageWrapper>
  );
}

export default function ForgePluginsWrapper() {
  return (
    <SmartCardProvider client={smartCardClient}>
      <ForgePlugins />
    </SmartCardProvider>
  );
}
