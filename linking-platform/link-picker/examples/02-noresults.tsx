import React, { Fragment, type SyntheticEvent, useMemo, useState } from 'react';

import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { mockAvailableSites } from '@atlaskit/linking-common/mocks';
import { token } from '@atlaskit/tokens';
import {
  AtlassianLinkPickerPlugin,
  Scope,
} from '@atlassian/link-picker-atlassian-plugin';
import { mockEndpoints } from '@atlassian/recent-work-client/mocks';

import { PageWrapper } from '../example-helpers/common';
import { mockPluginEndpointsNoData } from '../example-helpers/mock-plugin-endpoints';
import { MOCK_NO_RESULTS } from '../example-helpers/mock-recents-data';
import { LinkPicker, type LinkPickerProps } from '../src';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

mockPluginEndpointsNoData();
mockEndpoints(undefined, undefined, MOCK_NO_RESULTS);
mockAvailableSites();

function Basic() {
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

  const plugins = useMemo(
    () => [
      new AtlassianLinkPickerPlugin({
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        scope: Scope.ConfluencePageBlog,
        aggregatorUrl:
          'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
        activityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',
        products: ['confluence'],
      }),
    ],
    [],
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
    <Fragment>
      <div style={{ paddingBottom: token('space.250', '20px') }}>
        <a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
          {link.displayText || link.url}
        </a>
      </div>
      {linkPicker}
    </Fragment>
  );
}

export default function BasicWrapper() {
  return (
    <PageWrapper>
      <Basic />
    </PageWrapper>
  );
}
