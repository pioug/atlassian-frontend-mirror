/** @jsx jsx */
import { jsx } from '@emotion/core';
import { smallImage } from '@atlaskit/media-test-helpers';

import { BlockCardResolvedView } from '../src/BlockCard';
import { VRTestCase } from './utils/common';

export default () => (
  <VRTestCase title="Block card with CollaboratorList">
    {() => (
      <BlockCardResolvedView
        icon={{ url: smallImage }}
        users={[
          {
            src: smallImage,
            name: 'Abhi',
          },
          {
            src: smallImage,
            name: 'Adil',
          },
          {
            src: smallImage,
            name: 'Bright',
          },
          {
            src: smallImage,
            name: 'Corne',
          },
          {
            src: smallImage,
            name: 'Hector',
          },
          {
            src: smallImage,
            name: 'Jonno',
          },
          {
            src: smallImage,
            name: 'Magda',
          },
          {
            src: smallImage,
            name: 'Patrick',
          },
          {
            src: smallImage,
            name: 'Paul',
          },
          {
            src: smallImage,
            name: 'Sam',
          },
          {
            src: smallImage,
            name: 'Sasha',
          },
          {
            src: smallImage,
            name: 'Tong',
          },
          {
            src: smallImage,
            name: 'Vijay',
          },
        ]}
        title="Smart Links - Designs"
        link="https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png"
        byline={'Updated 2 days ago. Created 3 days ago.'}
        thumbnail={smallImage}
        context={{ text: 'Dropbox', icon: smallImage }}
      />
    )}
  </VRTestCase>
);
