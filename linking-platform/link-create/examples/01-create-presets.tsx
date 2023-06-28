import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import {
  mockCreatePage,
  mockFetchPage,
  mockFetchSpace,
} from '@atlassian/link-create-confluence/mocks';
import { createDefaultPluginPresets } from '@atlassian/link-create-presets';

import LinkCreate from '../src';
import { CreatePayload } from '../src/common/types';

const CLOUD_ID = 'cloud-id';

// Mocks
mockFetchPage();
mockFetchSpace();
mockCreatePage();

function CreatePresets() {
  const [link, setLink] = useState<string | null>();
  const [active, setActive] = useState(false);

  const handleCreate = useCallback((payload: CreatePayload) => {
    setLink(payload.url);
    setActive(false);
  }, []);

  const handleFailure = useCallback(() => {
    console.log('An error');
  }, []);

  const handleCancel = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {link && (
        <div style={{ marginBottom: '1rem' }}>
          <a href={link} target="_blank" rel="noopener noreferrer nofollow">
            {link}
          </a>
        </div>
      )}

      <Button appearance="primary" onClick={() => setActive(true)}>
        Create
      </Button>
      <LinkCreate
        plugins={createDefaultPluginPresets(CLOUD_ID)}
        entityKey="confluence-page"
        onCreate={handleCreate}
        onFailure={handleFailure}
        onCancel={handleCancel}
        active={active}
      />
    </div>
  );
}

export default function Create() {
  return (
    <IntlProvider locale="en">
      <CreatePresets />
    </IntlProvider>
  );
}
