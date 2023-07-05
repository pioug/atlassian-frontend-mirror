import React, { useMemo } from 'react';

import { useLinkPickerEditorProps } from '@atlassian/link-picker-plugins/editor';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

import { default as FullPageExample } from './5-full-page';

const smartCardClient = new CardClient('staging');

const FullPageWithLinkPicker = () => {
  const linkPicker = useLinkPickerEditorProps(undefined, {
    product: 'confluence',
    activityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',
    cloudId: 'a957adff-45b0-4f4f-8669-b640ed9973b6',
    aggregatorUrl: 'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
  });

  return (
    <FullPageExample
      editorProps={{
        linking: { linkPicker },
        featureFlags: {
          'lp-link-picker': true,
          'lp-link-picker-focus-trap': true,
          'lp-analytics-events-next': true,
          'prevent-popup-overflow': true,
        },
      }}
    />
  );
};

export default () => {
  const featureFlags = useMemo(() => {
    return {
      useLinkPickerAtlassianTabs: true,
    } as const;
  }, []);

  return (
    <SmartCardProvider client={smartCardClient} featureFlags={featureFlags}>
      <FullPageWithLinkPicker />
    </SmartCardProvider>
  );
};
