jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import { renamePaginationPropTypeToPaginationProps } from '../migrations/rename-pagination-prop-types';

const transformer = createTransformer([
  renamePaginationPropTypeToPaginationProps,
]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Rename PaginationPropTypes to PaginationProps - with alias', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React from 'react';
      import Pagination from '@atlaskit/pagination';
      import { PaginationPropTypes } from '@atlaskit/pagination';
    `,
    `
      import React from 'react';
      import Pagination from '@atlaskit/pagination';
      import { PaginationProps as PaginationPropTypes } from '@atlaskit/pagination';
    `,
    'should rename PaginationPropTypes to PaginationProps - with alias ',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React from 'react';
      import Pagination, { PaginationPropTypes } from '@atlaskit/pagination';
    `,
    `
      import React from 'react';
      import Pagination, { PaginationProps as PaginationPropTypes } from '@atlaskit/pagination';
    `,
    'should rename PaginationPropTypes to PaginationProps with alias if it is there along with default import',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
      import React from 'react';
      import Pagination, { PaginationPropTypes as CustomPaginationPropTypes } from '@atlaskit/pagination';
    `,
    `
      import React from 'react';
      import Pagination, { PaginationProps as CustomPaginationPropTypes } from '@atlaskit/pagination';
    `,
    'should preserve old alias name',
  );
});
