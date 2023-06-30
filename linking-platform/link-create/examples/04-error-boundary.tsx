import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { createConfluencePageLinkCreatePlugin } from '@atlassian/link-create-confluence';

import LinkCreate from '../src';
import { CreatePayload } from '../src/common/types';

const CLOUD_ID = 'cloud-id';
const BASE_URL = 'https://atlassian.com/';

function CreateError() {
  const [link, setLink] = useState<string | null>();
  const [active, setActive] = useState(false);

  const plugins = [
    createConfluencePageLinkCreatePlugin({
      cloudId: CLOUD_ID,
      baseUrl: BASE_URL,
    }),
  ];

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

      <Button
        testId="link-create-show"
        appearance="primary"
        onClick={() => setActive(true)}
      >
        Create
      </Button>
      <LinkCreate
        testId="link-create"
        plugins={plugins}
        entityKey={'undefined' as any} // Rip: force an unexpected error
        onCreate={handleCreate}
        onCancel={handleCancel}
        onFailure={handleFailure}
        active={active}
      />
    </div>
  );
}

export default function Create() {
  return (
    <IntlProvider locale="en">
      <CreateError />
    </IntlProvider>
  );
}
