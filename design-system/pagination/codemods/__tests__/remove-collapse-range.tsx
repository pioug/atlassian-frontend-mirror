jest.autoMockOff();
import { createTransformer } from '@atlaskit/codemod-utils';

import { removeCollapseRange } from '../migrations/remove-collapase-range';

const transformer = createTransformer([removeCollapseRange]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Remove innerProps', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Pagination from '@atlaskit/pagination';
    const SimplePagination = () => {
      return (
        <Pagination
          pages={[1,2,3,4]}
          testId="pagination"
          collapseRange={() => {}}
         />
      );
    };
  `,
    `/* TODO: (from codemod) Pagination collapseRange prop has now been removed to achieve more performance.
    We have not replaced 'collapseRange' with an equivalent API due to its minimal usage and prevent unwanted customisation.
    As an alternate, can look for similar customistation via existing 'components' or 'renderEllipsis' prop */
    import React from 'react';
    import Pagination from '@atlaskit/pagination';
    const SimplePagination = () => {
      return <Pagination pages={[1,2,3,4]} testId="pagination" />;
    };
  `,
    'should remove collapseRange props from Pagination',
  );
});
