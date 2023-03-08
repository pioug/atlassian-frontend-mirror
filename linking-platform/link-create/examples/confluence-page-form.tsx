import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { confluencePageLinkCreatePlugin } from '@atlassian/link-create-confluence';

import LinkCreate from '../src';

export default function Basic() {
  const [active, setActive] = useState(false);
  const plugins = [confluencePageLinkCreatePlugin];

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
          setActive(false);
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
