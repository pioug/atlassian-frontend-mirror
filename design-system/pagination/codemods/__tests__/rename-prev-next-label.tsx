jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import {
  renameNextProp,
  renamePrevProp,
} from '../migrations/rename-prev-next-label';

const transformer = createTransformer([renameNextProp, renamePrevProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Rename previous and next label', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Pagination from '@atlaskit/pagination';

    const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const SimplePagination = () => {
      return (
        <Pagination
          testId="pagination"
          pages={Pages}
          prev={'pr'}
          next={'ne'}/>
      );
    }
  `,
    `
    import React from 'react';
    import Pagination from '@atlaskit/pagination';

    const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const SimplePagination = () => {
      return (
        <Pagination
          testId="pagination"
          pages={Pages}
          prevLabel={'pr'}
          nextLabel={'ne'}/>
      );
    }
  `,
    'should rename previous and next label to prevLabel and nextLabel',
  );
});
