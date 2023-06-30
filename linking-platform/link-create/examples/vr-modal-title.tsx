import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { createConfluencePageLinkCreatePlugin } from '@atlassian/link-create-confluence';
import {
  mockFetchPage,
  mockFetchSpace,
} from '@atlassian/link-create-confluence/mocks';

import LinkCreate from '../src';

const CLOUD_ID = 'cloud-id';

mockFetchPage();
mockFetchSpace();

export default function Create() {
  const plugins = [createConfluencePageLinkCreatePlugin({ cloudId: CLOUD_ID })];
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
