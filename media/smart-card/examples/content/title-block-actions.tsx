import React from 'react';
import { ActionName, TitleBlock } from '../../src';
import ExampleContainer from './example-container';

export default () => (
  <ExampleContainer>
    <TitleBlock
      actions={[{ name: ActionName.EditAction, onClick: () => {} }]}
    />
  </ExampleContainer>
);
