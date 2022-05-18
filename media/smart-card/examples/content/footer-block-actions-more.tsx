import React from 'react';
import LikeIcon from '@atlaskit/icon/glyph/like';
import { ActionName, FooterBlock } from '../../src';
import ExampleContainer from './example-container';

export default () => (
  <ExampleContainer>
    <FooterBlock
      actions={[
        {
          name: ActionName.CustomAction,
          icon: <LikeIcon label="Like" />,
          content: 'Like',
          onClick: () => console.log('Like clicked!'),
        },
        {
          name: ActionName.EditAction,
          onClick: () => console.log('Edit clicked!'),
        },
        {
          name: ActionName.DeleteAction,
          onClick: () => console.log('Delete clicked!'),
        },
      ]}
    />
  </ExampleContainer>
);
