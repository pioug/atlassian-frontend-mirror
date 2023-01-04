import React, { useMemo } from 'react';

import { createSearchProvider, Scope } from '@atlassian/search-provider';
import { AtlassianLinkPickerPlugin } from '@atlassian/link-picker-atlassian-plugin';
import { useLinkPickerEditorProps } from '@atlassian/link-picker-plugins/editor';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

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

const smartCardClient = new CardClient('staging');

const FullPageWithLinkPicker = () => {
  const linkPicker = useLinkPickerEditorProps({
    plugins: [atlassianPlugin],
  });

  return (
    <FullPageExample
      editorProps={{
        linking: { linkPicker },
        featureFlags: {
          'lp-link-picker': true,
          'lp-link-picker-focus-trap': true,
          'prevent-popup-overflow': true,
        },
      }}
    />
  );
};

export default () => {
  const featureFlags = useMemo(() => {
    const flagKey = 'disableLinkPickerPopupPositioningFix';
    return {
      [flagKey]: Boolean(
        new URLSearchParams(window.location.search).get(flagKey) ?? false,
      ),
    } as const;
  }, []);

  return (
    <SmartCardProvider client={smartCardClient} featureFlags={featureFlags}>
      <FullPageWithLinkPicker />
    </SmartCardProvider>
  );
};
``;
