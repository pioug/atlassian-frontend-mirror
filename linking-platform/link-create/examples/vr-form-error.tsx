import React, { useCallback, useState } from 'react';

import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { createConfluencePageLinkCreatePlugin } from '@atlassian/link-create-confluence';

import LinkCreate from '../src';
import { CreatePayload } from '../src/common/types';

const CLOUD_ID = 'cloud-id';

fetchMock.restore();

function FormErrors() {
  const [link, setLink] = useState<string | null>();
  const [active, setActive] = useState(false);

  const plugins = [createConfluencePageLinkCreatePlugin({ cloudId: CLOUD_ID })];

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
        entityKey="confluence-page"
        onCreate={handleCreate}
        onFailure={handleFailure}
        onCancel={handleCancel}
        active={active}
        triggeredFrom="example"
      />
    </div>
  );
}

export default function Create() {
  return (
    <IntlProvider locale="en">
      <FormErrors />
    </IntlProvider>
  );
}
