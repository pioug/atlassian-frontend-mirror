import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { LinkPicker } from '@atlaskit/link-picker';
import Popup from '@atlaskit/popup';
import { createConfluencePageLinkCreatePlugin } from '@atlassian/link-create-confluence';
import {
  mockCreatePage,
  mockFetchPage,
  mockFetchSpace,
} from '@atlassian/link-create-confluence/mocks';
import {
  Scope,
  useAtlassianPlugins,
} from '@atlassian/link-picker-atlassian-plugin';

import LinkCreate from '../src';

// Mocks
mockFetchPage();
mockFetchSpace();
mockCreatePage();

// This is the cloud id for pug.jira-dev.com
const CLOUD_ID = 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5';

const LinkPickerCreate = () => {
  const [link, setLink] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const confluenceForm = createConfluencePageLinkCreatePlugin(
    CLOUD_ID,
    undefined,
    'current',
  );

  const [entityKey, setEntityKey] = useState(confluenceForm.key);

  const createPlugins = [confluenceForm];
  const pickerPlugins = useAtlassianPlugins([
    {
      cloudId: CLOUD_ID,
      tabConfig: {
        tabKey: 'confluence',
        tabTitle: 'Confluence',
      },
      products: ['confluence'],
      scope: Scope.ConfluencePageBlog,
      action: {
        label: 'Create New',
        callback: () => {
          setEntityKey(confluenceForm.key);
          setShowCreateModal(true);
        },
      },
    },
  ]);

  // Event handlers
  const onCancel = () => setShowPicker(false);
  const onSubmit = (payload: { url: string }) => {
    setLink(payload.url);
    console.log(payload);
  };

  return (
    <div style={{ padding: '20px' }}>
      {link && (
        <div style={{ marginBottom: '1rem' }}>
          <a href={link} target="_blank" rel="noopener noreferrer nofollow">
            {link}
          </a>
        </div>
      )}
      <Popup
        isOpen={showPicker}
        autoFocus={false}
        content={() => (
          <LinkPicker
            plugins={pickerPlugins}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )}
        trigger={props => (
          <Button
            {...props}
            appearance="primary"
            onClick={() => setShowPicker(!showPicker)}
          >
            Toggle
          </Button>
        )}
      />
      <LinkCreate
        plugins={createPlugins}
        onCancel={() => setShowCreateModal(false)}
        onCreate={(url: string) => {
          setLink(url);
          console.log(url);
          setShowCreateModal(false);
          setShowPicker(false);
        }}
        entityKey={entityKey}
        active={showCreateModal}
      />
    </div>
  );
};

export default function Create() {
  return (
    <IntlProvider locale="en">
      <LinkPickerCreate />
    </IntlProvider>
  );
}
