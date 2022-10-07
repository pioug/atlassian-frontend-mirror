import React from 'react';

import { createSearchProvider, Scope } from '@atlassian/search-provider';
import { AtlassianLinkPickerPlugin } from '@atlassian/link-picker-atlassian-plugin';
import { useLinkPickerEditorProps } from '@atlassian/link-picker-plugins/editor';

import { default as FullPageExample } from './5-full-page';

const searchProvider = Promise.resolve(
  createSearchProvider(
    'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
    Scope.ConfluencePageBlog,
    'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
  ),
);

const atlassianPlugin = new AtlassianLinkPickerPlugin({
  searchProvider,
  activityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',
});

export default () => {
  const linkPicker = useLinkPickerEditorProps({
    plugins: [atlassianPlugin],
  });

  return (
    <FullPageExample
      linking={{ linkPicker }}
      featureFlags={{ 'lp-link-picker': true }}
    />
  );
};
