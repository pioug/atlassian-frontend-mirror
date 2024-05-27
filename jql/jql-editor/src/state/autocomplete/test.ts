import { of } from 'rxjs/observable/of';

import { OPERATORS } from '@atlaskit/jql-ast';

import { type AutocompleteOptions } from '../../plugins/autocomplete/components/types';

import { ORDERED_OPERATORS, sortOperators } from './index';

describe('sortOperators', () => {
  it('uses an ordered list of operators matching the AST', () => {
    expect(ORDERED_OPERATORS).toHaveLength(OPERATORS.length);
    expect(ORDERED_OPERATORS).toEqual(
      expect.arrayContaining(OPERATORS as unknown as string[]),
    );
  });

  it('returns an observable with the correct order', () => {
    const operators$ = of<AutocompleteOptions>([
      {
        name: 'was',
        value: 'was',
      },
      {
        name: 'changed',
        value: 'changed',
      },
      {
        name: '!=',
        value: '!=',
      },
      {
        name: '=',
        value: '=',
      },
      {
        name: 'is not',
        value: 'is not',
      },
    ]);
    const sortedOperators$ = sortOperators(operators$);
    // @ts-ignore
    sortedOperators$.subscribe(result => {
      expect(result).toEqual([
        {
          name: '=',
          value: '=',
        },
        {
          name: '!=',
          value: '!=',
        },
        {
          name: 'is not',
          value: 'is not',
        },
        {
          name: 'was',
          value: 'was',
        },
        {
          name: 'changed',
          value: 'changed',
        },
      ]);
    });
  });
});
