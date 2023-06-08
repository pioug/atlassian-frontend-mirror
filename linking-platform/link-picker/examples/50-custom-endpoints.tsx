import React, { SyntheticEvent, useState, useMemo } from 'react';

import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

import {
  AtlassianLinkPickerPlugin,
  Scope,
} from '@atlassian/link-picker-atlassian-plugin';
import { useForgeSearchProviders } from '@atlassian/link-picker-plugins';

import { LinkPicker, LinkPickerProps } from '../src';
import { PageHeader, PageWrapper } from '../example-helpers/common';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

const smartCardClient = new CardClient('staging');

function CustomEndPoints() {
  const [isOpen, setIsOpen] = useState(true);
  const [link, setLink] = useState<OnSubmitPayload>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });
  const linkAnalytics = useSmartLinkLifecycleAnalytics();

  const handleSubmit: LinkPickerProps['onSubmit'] = (payload, analytic) => {
    setLink(payload);
    linkAnalytics.linkCreated(payload, analytic);
    setIsOpen(false);
  };

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleCancel = () => setIsOpen(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const forgePlugins = useForgeSearchProviders();
  const plugins = useMemo(
    () => [
      new AtlassianLinkPickerPlugin({
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        scope: Scope.ConfluencePageBlogWhiteboard,
        aggregatorUrl:
          'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
        activityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',
      }),
      ...forgePlugins,
    ],
    [forgePlugins],
  );

  const linkPickerInPopup = (
    <Popup
      isOpen={isOpen}
      autoFocus={false}
      onClose={handleToggle}
      content={({ update }) => (
        <LinkPicker
          plugins={plugins}
          url={link.url}
          displayText={link.displayText}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onContentResize={update}
        />
      )}
      placement="right-start"
      trigger={({ ref, ...triggerProps }) => (
        <Button
          {...triggerProps}
          ref={ref}
          appearance="primary"
          isSelected={isOpen}
          onClick={handleToggle}
        >
          {isOpen ? '-' : '+'}
        </Button>
      )}
    />
  );

  return (
    <PageWrapper>
      <PageHeader>
        <p>
          <b>Unmocked endpoints</b> (requires access to Staging)
        </p>
      </PageHeader>
      <div style={{ paddingBottom: 20 }}>
        <a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
          {link.displayText || link.url}
        </a>
      </div>
      {linkPickerInPopup}
    </PageWrapper>
  );
}

export default function ForgePluginsWrapper() {
  return (
    <SmartCardProvider client={smartCardClient}>
      <CustomEndPoints />
    </SmartCardProvider>
  );
}
