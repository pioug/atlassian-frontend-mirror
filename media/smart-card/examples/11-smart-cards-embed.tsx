import React from 'react';
import { Provider, Card, Client } from '../src';

export default () => (
  <Provider client={new Client('stg')}>
    <div style={{ width: '680px', margin: '0 auto', marginTop: '64px' }}>
      {/* Resolved */}
      <Card
        appearance="embed"
        url="https://www.dropbox.com/sh/0isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0"
      />
      {/* Not Found - random URL */}
      <Card
        appearance="embed"
        url="https://www.dropbox.com/sh/0000isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0"
      />
      {/*  */}
      <Card
        appearance="embed"
        url="https://www.dropbox.com/sh/0000isygvcskxbdwee/AADMfqcGx4XR15DeKnRo_YzHa?dl=0"
      />
    </div>
  </Provider>
);
