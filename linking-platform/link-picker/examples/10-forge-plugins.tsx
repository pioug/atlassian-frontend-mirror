import React, { SyntheticEvent, useState } from 'react';

import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

import { useLinkPickerPlugins } from '@atlassian/link-picker-plugins';

import { LinkPicker, LinkPickerProps } from '../src';
import { PageHeader, PageWrapper } from '../example-helpers/common';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

const smartCardClient = new CardClient('staging');

// mockPluginEndpoints();
// mockRecentsEndPoints(undefined, undefined, mockRecentData);

const LINK_PICKER_PLUGINS_CONFIG = {
  product: 'Confluence',
  activityClientEndpoint: 'https://start.stg.atlassian.com/gateway/api/graphql',
  aggregatorUrl: 'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
  cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
};

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

  const plugins = useLinkPickerPlugins(LINK_PICKER_PLUGINS_CONFIG);

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
    <SmartCardProvider
      client={smartCardClient}
      featureFlags={{
        useLinkPickerScrollingTabs: true,
        useLinkPickerAtlassianTabs: true,
      }}
    >
      <ForgePlugins />
    </SmartCardProvider>
  );
}
