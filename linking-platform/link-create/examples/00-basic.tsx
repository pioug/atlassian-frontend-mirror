import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { confluencePageLinkCreatePlugin } from '@atlassian/link-create-confluence';

import LinkCreate from '../src';

export default function Basic() {
  const [link, setLink] = useState<string | null>();
  const [active, setActive] = useState(false);

  const plugins = [confluencePageLinkCreatePlugin];

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
        testId="link-create"
        plugins={plugins}
        entityKey="confluence-page"
        onCreate={handleCreate}
        onFailure={handleFailure}
        onCancel={handleCancel}
        active={active}
      />
    </div>
  );
}
