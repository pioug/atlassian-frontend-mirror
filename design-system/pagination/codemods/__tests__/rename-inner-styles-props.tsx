jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import { renameInnerStylesProps } from '../migrations/rename-inner-styles-props';

const transformer = createTransformer([renameInnerStylesProps]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Rename innerStyles to style', () => {
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
          innerStyles={{ marginTop: '24px' }}/>
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
          style={{ marginTop: '24px' }}/>
      );
    }
  `,
    'should rename innerStyles prop to style prop',
  );
});
