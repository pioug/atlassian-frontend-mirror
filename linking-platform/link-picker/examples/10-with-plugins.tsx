import React, { SyntheticEvent, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import {
  AtlassianLinkPickerPlugin,
  Scope,
} from '@atlassian/link-picker-atlassian-plugin';
import { mockEndpoints } from '@atlassian/recent-work-client/mocks';
import mockRecentData from '../example-helpers/mock-data';
import { LinkPicker, LinkPickerPlugin } from '../src';

type OnSubmitPayload = Parameters<
  Required<React.ComponentProps<typeof LinkPicker>>['onSubmit']
>[0];

mockEndpoints(undefined, undefined, mockRecentData);

export default function InPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [link, setLink] = useState<OnSubmitPayload>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSubmit = (payload: OnSubmitPayload) => {
    setLink(payload);
    setIsOpen(false);
  };

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const plugins: [LinkPickerPlugin] = React.useMemo(
    () => [
      new AtlassianLinkPickerPlugin({
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        scope: Scope.ConfluencePageBlog,
        aggregatorUrl:
          'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
        activityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',
      }),
    ],
    [],
  );

  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
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
              onCancel={handleToggle}
              onContentResize={update}
            />
          )}
          placement="bottom-start"
          trigger={({ ref, ...triggerProps }) => (
            <Button
              {...triggerProps}
              ref={ref}
              appearance="primary"
              isSelected={isOpen}
              onClick={handleToggle}
            >
              Toggle
            </Button>
          )}
        />
        <div onClick={handleClick}>
          <a href={link.url} target="_blank">
            {link.displayText || link.url}
          </a>
        </div>
      </IntlProvider>
    </div>
  );
}
