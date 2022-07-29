import React, { SyntheticEvent, useState } from 'react';
import { IntlProvider } from 'react-intl-next';

import {
  AtlassianLinkPickerPlugin,
  Scope,
} from '@atlassian/link-picker-atlassian-plugin';
import { useForgeSearchProviders } from '@atlassian/link-picker-plugins';

import { LinkPicker, LinkPickerPlugin } from '../src';

type OnSubmitPayload = Parameters<
  Required<React.ComponentProps<typeof LinkPicker>>['onSubmit']
>[0];

export default function Basic() {
  const [link, setLink] = useState<OnSubmitPayload>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });
  const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(true);

  const handleSubmit = (payload: OnSubmitPayload) => {
    setLink(payload);
    setIsLinkPickerVisible(false);
  };

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLinkPickerVisible(true);
  };

  const forgePlugins: LinkPickerPlugin[] = useForgeSearchProviders('stg');
  const handleCancel = () => setIsLinkPickerVisible(false);
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
