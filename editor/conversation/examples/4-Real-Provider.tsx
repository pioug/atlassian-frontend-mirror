import React from 'react';
import { Demo } from '../example-helpers/DemoPage';
import { MOCK_USERS } from '../example-helpers/MockData';
import { getDataProviderFactory } from '../example-helpers/MockProvider';
import { ConversationResource } from '../src/api/ConversationResource';

const provider = new ConversationResource({
  url: 'http://localhost:8080',
  user: MOCK_USERS[0],
});

export default function Example() {
  return <Demo provider={provider} dataProviders={getDataProviderFactory()} />;
}
