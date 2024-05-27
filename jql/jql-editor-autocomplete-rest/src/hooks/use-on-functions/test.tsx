import React, { useRef } from 'react';

import { render } from '@testing-library/react';
import { from } from 'rxjs/observable/from';

import { type AutocompleteOptions } from '@atlaskit/jql-editor-common';

import {
  accountJqlField,
  accountManagerJqlField,
  assigneeJqlField,
  collapsedCustomField,
  componentJqlField,
  currentUserFunction,
  doubleQuotedJqlField,
  forgeJqlFunction,
  inactiveUsersFunction,
  membersOfFunction,
  nonAutocompletableField,
  nonOrderableJqlField,
  singleQuotedJqlField,
  statusJqlField,
  updatedByFunction,
} from '../../common/mocks';
import { type JQLFieldResponse, type JQLFunctionResponse } from '../../common/types';

import useOnFunctions from './index';

const mockJqlSearchableFields: JQLFieldResponse[] = [
  accountJqlField,
  accountManagerJqlField,
  assigneeJqlField,
  componentJqlField,
  doubleQuotedJqlField,
  singleQuotedJqlField,
  statusJqlField,
  nonOrderableJqlField,
  nonAutocompletableField,
  collapsedCustomField,
];

const mockJqlFunctions: JQLFunctionResponse[] = [
  currentUserFunction,
  membersOfFunction,
  updatedByFunction,
  inactiveUsersFunction,
  forgeJqlFunction,
];

const mapToAutocompleteOptions = (
  data: JQLFunctionResponse[],
): AutocompleteOptions =>
  data.map(item => {
    return {
      name: item.displayName,
      value: item.value,
      isListFunction:
        item.isList === 'true' ||
        item.supportsListAndSingleValueOperators === 'true',
    };
  });

describe('onFunctions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const onNext = jest.fn();

  type OnFunctionsConsumerProps = {
    jqlSearchableFields: JQLFieldResponse[];
    jqlFunctions: JQLFunctionResponse[];
    field?: string;
    query?: string;
    isListOperator?: boolean;
    done: jest.DoneCallback;
    onAssert: (fields: AutocompleteOptions) => void;
  };

  const OnFunctionsConsumer = ({
    jqlSearchableFields,
    jqlFunctions,
    onAssert,
    field,
    query,
    isListOperator,
    done,
  }: OnFunctionsConsumerProps) => {
    const onFunctions = useOnFunctions(
      from(jqlSearchableFields),
      from(jqlFunctions),
    );
    const functions = useRef<AutocompleteOptions>([]);

    onFunctions(query, field, isListOperator).subscribe({
      next: data => {
        onNext();
        functions.current = data;
      },
      complete: () => {
        try {
          onAssert(functions.current);
          done();
        } catch (e) {
          done(e);
        }
      },
    });

    return null;
  };

  it('returns functions if field does not support autocomplete', done => {
    const field = nonAutocompletableField.value;
    const assertFunctions = (functions: AutocompleteOptions) => {
      const expectedFunctions = mapToAutocompleteOptions([
        currentUserFunction,
        membersOfFunction,
        forgeJqlFunction,
      ]);
      expect(functions).toEqual(expectedFunctions);
    };

    render(
      <OnFunctionsConsumer
        jqlSearchableFields={mockJqlSearchableFields}
        jqlFunctions={mockJqlFunctions}
        field={field}
        onAssert={assertFunctions}
        done={done}
      />,
    );
  });

  it('returns functions for a JQL field with a matching type', done => {
    const field = 'assignee';
    const assertFunctions = (functions: AutocompleteOptions) => {
      const expectedFunctions = mapToAutocompleteOptions([
        currentUserFunction,
        membersOfFunction,
        forgeJqlFunction,
      ]);
      expect(functions).toEqual(expectedFunctions);
    };

    render(
      <OnFunctionsConsumer
        jqlSearchableFields={mockJqlSearchableFields}
        jqlFunctions={mockJqlFunctions}
        field={field}
        onAssert={assertFunctions}
        done={done}
      />,
    );
  });

  it('returns functions for a JQL field with a matching type that starts with the provided query', done => {
    const field = 'assignee';
    const query = 'mem';
    const assertFunctions = (functions: AutocompleteOptions) => {
      const expectedFunctions = mapToAutocompleteOptions([membersOfFunction]);
      expect(functions).toEqual(expectedFunctions);
    };

    render(
      <OnFunctionsConsumer
        jqlSearchableFields={mockJqlSearchableFields}
        jqlFunctions={mockJqlFunctions}
        field={field}
        query={query}
        onAssert={assertFunctions}
        done={done}
      />,
    );
  });

  it('returns both list and non-list functions if a list operator is used', done => {
    const field = 'assignee';
    const query = '';
    const isListOperator = true;
    const assertFunctions = (functions: AutocompleteOptions) => {
      const expectedFunctions = mapToAutocompleteOptions([
        currentUserFunction,
        membersOfFunction,
        inactiveUsersFunction,
        forgeJqlFunction,
      ]);
      expect(functions).toEqual(expectedFunctions);
    };

    render(
      <OnFunctionsConsumer
        jqlSearchableFields={mockJqlSearchableFields}
        jqlFunctions={mockJqlFunctions}
        field={field}
        query={query}
        isListOperator={isListOperator}
        onAssert={assertFunctions}
        done={done}
      />,
    );
  });

  it('only returns single value functions if a list operator is not used', done => {
    const field = 'assignee';
    const query = '';
    const isListOperator = false;
    const assertFunctions = (functions: AutocompleteOptions) => {
      const expectedFunctions = mapToAutocompleteOptions([
        currentUserFunction,
        membersOfFunction,
        forgeJqlFunction,
      ]);
      expect(functions).toEqual(expectedFunctions);
    };

    render(
      <OnFunctionsConsumer
        jqlSearchableFields={mockJqlSearchableFields}
        jqlFunctions={mockJqlFunctions}
        field={field}
        query={query}
        isListOperator={isListOperator}
        onAssert={assertFunctions}
        done={done}
      />,
    );
  });
});
