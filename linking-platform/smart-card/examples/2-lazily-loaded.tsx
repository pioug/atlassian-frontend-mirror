import React from 'react';
import { Provider, Card, Client } from '../src';

export default () => (
  <Provider client={new Client('staging')}>
    <div>
      <p>Scroll ⇣ to find a lazily loaded smart card 👇</p>
      <div
        style={{ height: '3000px', display: 'flex', alignItems: 'flex-start' }}
      />
      <Card
        url="https://trello.com/b/8B5zyiSn/test-smart-card-board"
        appearance="block"
      />
    </div>
  </Provider>
);
