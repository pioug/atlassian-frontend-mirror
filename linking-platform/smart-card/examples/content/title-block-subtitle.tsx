import React from 'react';
import { ElementName, TitleBlock } from '../../src';
import ExampleContainer from './example-container';

export default () => (
  <ExampleContainer>
    <TitleBlock
      subtitle={[
        { name: ElementName.AuthorGroup },
        { name: ElementName.ModifiedOn },
        { name: ElementName.CommentCount },
      ]}
    />
  </ExampleContainer>
);
