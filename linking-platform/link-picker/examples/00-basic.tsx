import React, { SyntheticEvent, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { ufologger } from '@atlaskit/ufo';

import {
  AtlassianLinkPickerPlugin,
  Scope,
} from '@atlassian/link-picker-atlassian-plugin';
import { useForgeSearchProviders } from '@atlassian/link-picker-plugins';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

import { LinkPicker, LinkPickerProps, LinkPickerPlugin } from '../src';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

ufologger.enable();
const smartCardClient = new CardClient('staging');

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

  const forgePlugins: LinkPickerPlugin[] = useForgeSearchProviders();
  const plugins: LinkPickerPlugin[] = React.useMemo(
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
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <div onClick={handleClick}>
          <a href={link.url} target="_blank">
            {link.displayText || link.url}
          </a>
        </div>
        {linkPicker}
      </IntlProvider>
    </div>
  );
}

export default function BasicExampleWrapper() {
  return (
    <SmartCardProvider client={smartCardClient}>
      <Basic />
    </SmartCardProvider>
  );
}
