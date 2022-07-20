import React, { SyntheticEvent, useState } from 'react';
import { IntlProvider } from 'react-intl-next';

import { AtlassianLinkPickerPlugin } from '@atlassian/link-picker-atlassian-plugin';

import { searchProvider } from '../example-helpers/providers';
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

  const handleCancel = () => setIsLinkPickerVisible(false);

  const plugins: [LinkPickerPlugin] = React.useMemo(
    () => [
      new AtlassianLinkPickerPlugin({
        searchProvider,
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
