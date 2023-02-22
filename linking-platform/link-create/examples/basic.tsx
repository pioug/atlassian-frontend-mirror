import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import LinkCreate, { useLinkCreateCallback } from '../src';

const ConfluenceCreationForm = () => {
  const { onCreate, onFailure, onCancel } = useLinkCreateCallback();

  return (
    <div>
      This is a form. Trust me.
      <Button
        appearance="primary"
        onClick={() => onCreate && onCreate('https://www.atlassian.com')}
      >
        Success
      </Button>
      <Button appearance="primary" onClick={onFailure}>
        Trigger an error
      </Button>
      <Button appearance="primary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default function Basic() {
  const [active, setActive] = useState(false);
  const plugins = [
    {
      group: {
        label: 'Confluence',
        key: 'confluence',
        icon: 'beautiful',
      },
      key: 'confluence-page',
      label: 'Page',
      icon: 'beautiful',
      form: <ConfluenceCreationForm />,
    },
  ];

  return (
    <>
      <Button appearance="primary" onClick={() => setActive(true)}>
        Show Form
      </Button>
      <LinkCreate
        testId="link-create"
        plugins={plugins}
        entityKey="confluence-page"
        onCreate={url => {
          console.log(`${url} returned!`);
        }}
        onFailure={() => {
          console.log('An error');
        }}
        onCancel={() => setActive(false)}
        active={active}
      />
    </>
  );
}
