jest.autoMockOff();

import transformer from '../14.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Pagination code-mods', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Pagination from '@atlaskit/pagination';
    import type { PaginationPropTypes } from '@atlaskit/pagination';

    const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const SimplePagination = () => {
      return (
        <Pagination
          testId="pagination"
          pages={Pages}
          innerStyles={{ marginTop: '24px' }}
          i18n={{ prev: 'pr', next: 'ne' }}
          collapseRange={() => {}} />
      );
    }
  `,
    `/* TODO: (from codemod) Pagination i18n prop has now been removed and we have tried to flatten its child prev & next as a standalone props.
    There may be cases in which codemod might not automatically flat i18n prop of Pagination and have to be handled manually. */
    /* TODO: (from codemod) Pagination collapseRange prop has now been removed to achieve more performance.
    We have not replaced 'collapseRange' with an equivalent API due to its minimal usage and prevent unwanted customisation.
    As an alternate, can look for similar customistation via existing 'components' or 'renderEllipsis' prop */
    import React from 'react';
    import Pagination from '@atlaskit/pagination';
    import type { PaginationProps as PaginationPropTypes } from '@atlaskit/pagination';

    const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const SimplePagination = () => {
      return (
        <Pagination
          testId="pagination"
          pages={Pages}
          style={{ marginTop: '24px' }}
          prevLabel={'pr'}
          nextLabel={'ne'} />
      );
    }
  `,
    'should rename innerStyles to style, PaginationPropTypes to PaginationProps and add an alias to PaginationProps, also elevate i18n prev, next inner props, rename to prevLabel, nextLabel prop and remove collapseRange prop',
  );
});
