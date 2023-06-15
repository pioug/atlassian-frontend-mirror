import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { createConfluencePageLinkCreatePlugin } from '@atlassian/link-create-confluence';
import {
  mockFetchPage,
  mockFetchSpace,
} from '@atlassian/link-create-confluence/mocks';

import LinkCreate from '../src';

// This is the cloud id for pug.jira-dev.com
const CLOUD_ID = 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5';

mockFetchPage();
mockFetchSpace();

export default function Create() {
  const plugins = [createConfluencePageLinkCreatePlugin(CLOUD_ID)];
  return (
    <IntlProvider locale="en">
      <div style={{ padding: '20px' }}>
        <LinkCreate
          active={true}
          plugins={plugins}
          testId="link-create"
          entityKey="confluence-page"
          modalTitle="Create meeting notes"
        />
      </div>
    </IntlProvider>
  );
}
