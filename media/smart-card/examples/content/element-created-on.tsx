import React from 'react';
import { ElementName, MetadataBlock } from '../../src';
import ExampleContainer from './example-container';

export default () => (
  <ExampleContainer>
    <MetadataBlock primary={[{ name: ElementName.CreatedOn }]} />
  </ExampleContainer>
);
