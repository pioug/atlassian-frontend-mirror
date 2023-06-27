import React from 'react';
import { createRendererWindowBindings } from './helper/testing-setup';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

mockDatasourceFetchRequests();

export default function RendererExampleForTests() {
  createRendererWindowBindings(window);
  return <div id="renderer-container" />;
}
