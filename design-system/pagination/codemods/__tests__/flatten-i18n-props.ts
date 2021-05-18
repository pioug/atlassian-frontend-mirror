jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import { flattenI18nInnerPropsAsProp } from '../migrations/flatten-i18n-props';

const transformer = createTransformer([flattenI18nInnerPropsAsProp]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('Flatten i18n inner props', () => {
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
          i18n={{ prev: 'pr', next: 'ne' }}/>
      );
    };
  `,
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
    'should flatten prev & next properties in i18n props as a new standalone props',
  );

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
          i18n={{ 
            prev: messages.previousButton,
            next: messages.nextButton
          }}/>
      );
    };
  `,
    `
    import React from 'react';
    import Pagination from '@atlaskit/pagination';

    const SimplePagination = () => {
      return (
        <Pagination
          pages={[1,2,3,4]}
          testId="pagination"
          i18n={{ 
            prev: messages.previousButton,
            next: messages.nextButton
          }}
          prev={messages.previousButton}
          next={messages.nextButton} />
      );
    };
  `,
    'should flatten prev & next object properties in i18n props as a new standalone props',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from 'react';
    import Pagination from '@atlaskit/pagination';
    const message = { 
      prev: 'prevLabel',
      next: 'nextLabel',
    }
    const SimplePagination = () => {
      return (
        <Pagination
          pages={[1,2,3,4]}
          testId="pagination"
          i18n={message}/>
      );
    };
  `,
    `
    import React from 'react';
    import Pagination from '@atlaskit/pagination';
    const message = { 
      prev: 'prevLabel',
      next: 'nextLabel',
    }
    const SimplePagination = () => {
      return (
        <Pagination
          pages={[1,2,3,4]}
          testId="pagination"
          i18n={message}/>
      );
    };
  `,
    'should not flatten prev & next props if i18n value comming from a variable',
  );
});
