import React, { Fragment, useMemo, useState } from 'react';

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
import { LinkPicker, LinkPickerProps } from '../src';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

mockPluginEndpointsNoData();
mockEndpoints(undefined, undefined, MOCK_NO_RESULTS);
mockAvailableSites();

function Basic() {
  const [link] = useState<OnSubmitPayload>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });

  const plugins = useMemo(
    () => [
      new AtlassianLinkPickerPlugin({
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        scope: Scope.ConfluencePageBlog,
        aggregatorUrl:
          'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
        activityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',
        action: {
          label: {
            id: 'test',
            defaultMessage: 'Action',
            description: 'test action',
          },
          callback: () => {},
        },
        products: ['confluence', 'jira'],
      }),
    ],
    [],
  );

  return (
    <Fragment>
      <div style={{ paddingBottom: token('space.250', '20px') }}>
        <a id="test-link" href={link.url} target="_blank">
          {link.displayText || link.url}
        </a>
      </div>
      <LinkPicker
        plugins={plugins}
        url={link.url}
        displayText={link.displayText}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
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
