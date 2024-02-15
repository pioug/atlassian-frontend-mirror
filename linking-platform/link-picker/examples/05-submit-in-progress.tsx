import React, { Fragment, SyntheticEvent, useMemo, useState } from 'react';

import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { token } from '@atlaskit/tokens';
import {
  AtlassianLinkPickerPlugin,
  Scope,
} from '@atlassian/link-picker-atlassian-plugin';
import { mockEndpoints } from '@atlassian/recent-work-client/mocks';

import { PageWrapper } from '../example-helpers/common';
import { mockPluginEndpoints } from '../example-helpers/mock-plugin-endpoints';
import { MOCK_DATA_V3 as mockRecentData } from '../example-helpers/mock-recents-data';
import { LinkPicker, LinkPickerProps } from '../src';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

mockPluginEndpoints();
mockEndpoints(undefined, undefined, mockRecentData);

function SubmitInProgressExample() {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: LinkPickerProps['onSubmit'] = (payload, analytic) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setLink(payload);
      linkAnalytics.linkCreated(payload, analytic);
      setIsLinkPickerVisible(false);
      setIsSubmitting(false);
    }, 4000);
  };

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLinkPickerVisible(true);
    setIsSubmitting(false);
    setLink({
      url: '',
      displayText: null,
      title: null,
      meta: {
        inputMethod: 'manual',
      },
    });
  };

  const handleCancel = () => setIsLinkPickerVisible(false);

  const plugins = useMemo(
    () => [
      new AtlassianLinkPickerPlugin({
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        scope: Scope.ConfluencePageBlogWhiteboard,
        aggregatorUrl:
          'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
        activityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',
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
      isSubmitting={isSubmitting}
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
      <SubmitInProgressExample />
    </PageWrapper>
  );
}
