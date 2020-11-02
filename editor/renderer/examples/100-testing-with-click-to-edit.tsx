import React from 'react';

import { createRendererWindowBindings } from './helper/testing-setup';

export default function RendererExampleForTests() {
  createRendererWindowBindings(window, true);
  return <div id="renderer-container" />;
}
