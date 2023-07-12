import React, { useCallback, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';

import { MockPluginForm } from '../example-helpers/mock-plugin-form';
import LinkCreate from '../src';
import { CreatePayload } from '../src/common/types';

const ENTITY_KEY = 'object-name';

function FormErrors() {
  const [link, setLink] = useState<string | null>();
  const [active, setActive] = useState(false);

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
      form: <MockPluginForm shouldThrowError={true} />,
    };
  };

  const plugins = [mockPlugin()];

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
        entityKey={ENTITY_KEY}
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
