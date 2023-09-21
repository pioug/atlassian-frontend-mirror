import React, { Fragment, useMemo, useState } from 'react';

import Range from '@atlaskit/range';
import {
  AtlassianLinkPickerPlugin,
  Scope,
} from '@atlassian/link-picker-atlassian-plugin';
import { mockEndpoints } from '@atlassian/recent-work-client/mocks';

import { PageWrapper } from '../example-helpers/common';
import { mockPluginEndpoints } from '../example-helpers/mock-plugin-endpoints';
import { MOCK_DATA_V3 as mockRecentData } from '../example-helpers/mock-recents-data';
import { LinkPicker } from '../src';

mockPluginEndpoints();
mockEndpoints(undefined, undefined, mockRecentData);

const NOOP = () => {};

function CustomWidth() {
  const [width, setWidth] = useState(400);
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

  return (
    <Fragment>
      <label>Container Width</label>
      <Range
        min={200}
        max={1000}
        step={20}
        value={width}
        onChange={value => setWidth(value)}
      />
      <div style={{ width }}>
        <LinkPicker
          plugins={plugins}
          onSubmit={NOOP}
          onCancel={NOOP}
          disableWidth
        />
      </div>
    </Fragment>
  );
}

export default function CustomWidthWrapper() {
  return (
    <PageWrapper>
      <CustomWidth />
    </PageWrapper>
  );
}
