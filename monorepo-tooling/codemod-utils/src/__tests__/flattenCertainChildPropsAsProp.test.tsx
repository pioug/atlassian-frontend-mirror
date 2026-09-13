import { createTransformer, flattenCertainChildPropsAsProp } from '../utils';

const flattenI18nInnerPropsAsProp = flattenCertainChildPropsAsProp('@atlaskit/pagination', 'i18n', [
	'prev',
	'next',
]);

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
});
