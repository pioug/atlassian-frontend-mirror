import { createRemoveFuncAddCommentFor, createTransformer } from '../utils';

const removeInnerProps = createRemoveFuncAddCommentFor('@atlaskit/pagination', 'i18n');

const transformer = createTransformer([removeInnerProps]);

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
		`import React from 'react';
    import Pagination from '@atlaskit/pagination';
    const SimplePagination = () => {
      return (<Pagination pages={[1,2,3,4]} testId="pagination" prev={'pr'} next={'ne'} />);
    };
  `,
		'should remove i18n props from Pagination',
	);
});
