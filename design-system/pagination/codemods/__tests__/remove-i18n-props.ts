jest.autoMockOff();
import { createTransformer } from '@atlaskit/codemod-utils';

import { removeI18nProps } from '../migrations/remove-i18n-props';

const transformer = createTransformer([removeI18nProps]);

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
          i18n={{ prev: 'pr', next: 'ne' }}
          prev={'pr'}
          next={'ne'} />
      );
    };
  `,
    `
    /* TODO: (from codemod) Pagination i18n prop has now been removed and we have tried to flatten its child prev & next as a standalone props.
    There may be cases in which codemod might not automatically flat i18n prop of Pagination and have to be handled manually. */
    import React from 'react';
    import Pagination from '@atlaskit/pagination';
    const SimplePagination = () => {
      return <Pagination pages={[1,2,3,4]} testId="pagination" prev={'pr'} next={'ne'} />;
    };
  `,
    'should remove i18n props from Pagination',
  );
});
