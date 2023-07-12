import React from 'react';

import { IntlProvider } from 'react-intl-next';

import {
  mockFetchPage,
  mockFetchSpace,
} from '@atlassian/link-create-confluence/mocks';

import { MockPluginForm } from '../example-helpers/mock-plugin-form';
import LinkCreate from '../src';

const ENTITY_KEY = 'object-name';

mockFetchPage();
mockFetchSpace();

export default function Create() {
  const mockPlugin = () => {
    return {
      group: {
        label: 'test',
        icon: 'test-icon',
        key: 'mock-plugin',
      },
      label: 'label',
      icon: 'icon',
      key: ENTITY_KEY,
      form: <MockPluginForm />,
    };
  };

  const plugins = [mockPlugin()];

  return (
    <IntlProvider locale="en">
      <div style={{ padding: '20px' }}>
        <LinkCreate
          active={true}
          plugins={plugins}
          testId="link-create"
          entityKey={ENTITY_KEY}
          modalTitle="Create meeting notes"
        />
      </div>
    </IntlProvider>
  );
}
