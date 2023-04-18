import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { createDefaultPluginPresets } from '@atlassian/link-create-presets';

import LinkCreate from '../src';

// This is the cloud id for pug.jira-dev.com
const CLOUD_ID = 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5';

export default function Basic() {
  const [link, setLink] = useState<string | null>();
  const [active, setActive] = useState(false);

  const handleCreate = useCallback((url: string) => {
    setLink(url);
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
