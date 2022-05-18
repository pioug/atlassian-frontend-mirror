import React from 'react';
import { SnippetBlock } from '../../src';
import ExampleContainer from './example-container';

export default () => (
  <ExampleContainer>
    <SnippetBlock maxLines={1} />
  </ExampleContainer>
);
