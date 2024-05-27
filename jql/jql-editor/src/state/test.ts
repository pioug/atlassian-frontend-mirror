import { type StoreActionApi } from 'react-sweet-state';
import { empty } from 'rxjs/observable/empty';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Subscription } from 'rxjs/Subscription';

import { JQLParseError } from '@atlaskit/jql-ast';
import { type JQLRuleSuggestion, type JQLSuggestions } from '@atlaskit/jql-autocomplete';
import { type AutocompleteOptions } from '@atlaskit/jql-editor-common';

import * as analyticsActionsModule from './analytics';
import { type ExternalError, type Props, type State } from './types';
import { getAutocompleteOptionId } from './util';

import { actions, initialState } from './index';

const mockValues: AutocompleteOptions = [
  { name: 'Chuck Norris', value: '123-abc-456' },
  { name: 'Bruce Lee', value: 'abc-123-def' },
];

const noTokens: JQLSuggestions['tokens'] = {
  values: [],
  matchedText: '',
  replacePosition: [0, 0],
};

const emptyToken: JQLSuggestions['tokens'] = {
  values: ['EMPTY'],
  matchedText: '',
  replacePosition: [0, 0],
};

const multipleTokens: JQLSuggestions['tokens'] = {
  values: ['AND', 'OR', 'ORDER BY'],
  matchedText: 'o',
  replacePosition: [0, 0],
};

const getState = jest.fn(() => stateWithProviders);
const setState = jest.fn();
const dispatch: StoreActionApi<State>['dispatch'] = jest.fn(thunk =>
  thunk({ getState, setState, dispatch }, undefined),
);
const onFields = jest.fn(() => empty<AutocompleteOptions>());
const onOperators = jest.fn(() => empty<AutocompleteOptions>());
const onValues = jest.fn(() => empty<AutocompleteOptions>());
const onFunctions = jest.fn(() => empty<AutocompleteOptions>());
const appendOptionsForObservable = jest.fn(() => empty<AutocompleteOptions>());
const callAutocompleteProviders = jest.fn();
const cancelSubscription = jest.fn();
const setLoading = jest.fn();

const analyticsSubscription = new Subscription();
const onStopAutocompleteEvent = jest.fn();
const onStartAutocompleteEvent = jest.fn<
  analyticsActionsModule.AutocompleteEvent,
  []
>(() => {
  return {
    analyticsSubscription,
    onStopAutocompleteEvent,
  };
});

const stateWithProviders = {
  ...initialState,
  autocompleteProvider: {
    onFields,
    onOperators,
    onValues,
    onFunctions,
  },
};

describe('getAutocompleteOptions', () => {
  const suggestions = {
    tokens: multipleTokens,
    rules: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest
      .spyOn(actions, 'callAutocompleteProviders')
      .mockReturnValue(callAutocompleteProviders);
    jest
      .spyOn(actions, 'cancelSubscription')
      .mockReturnValue(cancelSubscription);
  });

  it('sets matching token options', () => {
    const thunk = actions.getAutocompleteOptions(suggestions);

    thunk({ getState, setState, dispatch });

    expect(setState).toHaveBeenCalledWith({
      autocomplete: {
        ...initialState.autocomplete,
        options: {
          ...initialState.autocomplete.options,
          tokens: [
            {
              id: getAutocompleteOptionId(multipleTokens.values[1]),
              name: multipleTokens.values[1],
              value: multipleTokens.values[1],
              replacePosition: multipleTokens.replacePosition,
              matchedText: multipleTokens.matchedText,
              context: null,
              type: 'keyword',
            },
            {
              id: getAutocompleteOptionId(multipleTokens.values[2]),
              name: multipleTokens.values[2],
              value: multipleTokens.values[2],
              replacePosition: multipleTokens.replacePosition,
              matchedText: multipleTokens.matchedText,
              context: null,
              type: 'keyword',
            },
          ],
        },
      },
    });
  });

  it('dispatches cancelSubscription and callAutocompleteProviders', () => {
    const thunk = actions.getAutocompleteOptions(suggestions);

    thunk({ getState, setState, dispatch });

    expect(dispatch).toHaveBeenNthCalledWith(1, cancelSubscription);
    expect(dispatch).toHaveBeenNthCalledWith(2, callAutocompleteProviders);
  });
});

describe('callAutocompleteProviders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest
      .spyOn(actions, 'appendOptionsForObservable')
      .mockReturnValue(appendOptionsForObservable);
    jest.spyOn(actions, 'setLoading').mockReturnValue(setLoading);
    jest
      .spyOn(analyticsActionsModule, 'onStartAutocompleteEvent')
      .mockReturnValue(onStartAutocompleteEvent);
  });

  it(`doesn't call any provider when no rule suggestions are available`, () => {
    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {},
    });

    thunk({ getState, setState, dispatch });

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('calls fields provider when field rule is suggested', () => {
    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {
        field: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(dispatch).toHaveBeenNthCalledWith(1, appendOptionsForObservable);
    expect(dispatch).toHaveBeenNthCalledWith(2, onStartAutocompleteEvent);
    expect(dispatch).toHaveBeenNthCalledWith(3, setLoading);
    expect(dispatch).toHaveBeenNthCalledWith(4, setLoading);
    expect(onFields).toHaveBeenCalled();
    expect(onOperators).not.toHaveBeenCalled();
    expect(onValues).not.toHaveBeenCalled();
    expect(onFunctions).not.toHaveBeenCalled();
  });

  it('calls operator provider when operator rule is suggested', () => {
    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {
        operator: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(dispatch).toHaveBeenNthCalledWith(1, appendOptionsForObservable);
    expect(dispatch).toHaveBeenNthCalledWith(2, onStartAutocompleteEvent);
    expect(dispatch).toHaveBeenNthCalledWith(3, setLoading);
    expect(dispatch).toHaveBeenNthCalledWith(4, setLoading);
    expect(onOperators).toHaveBeenCalled();
    expect(onFields).not.toHaveBeenCalled();
    expect(onValues).not.toHaveBeenCalled();
    expect(onFunctions).not.toHaveBeenCalled();
  });

  it('calls value provider when value rule is suggested', () => {
    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {
        value: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(dispatch).toHaveBeenNthCalledWith(1, appendOptionsForObservable);
    expect(dispatch).toHaveBeenNthCalledWith(2, onStartAutocompleteEvent);
    expect(dispatch).toHaveBeenNthCalledWith(3, setLoading);
    expect(dispatch).toHaveBeenNthCalledWith(4, setLoading);
    expect(onValues).toHaveBeenCalled();
    expect(onFields).not.toHaveBeenCalled();
    expect(onOperators).not.toHaveBeenCalled();
    expect(onFunctions).not.toHaveBeenCalled();
  });

  it('calls functions provider when function rule is suggested', () => {
    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {
        function: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(dispatch).toHaveBeenNthCalledWith(1, appendOptionsForObservable);
    expect(dispatch).toHaveBeenNthCalledWith(2, onStartAutocompleteEvent);
    expect(dispatch).toHaveBeenNthCalledWith(3, setLoading);
    expect(dispatch).toHaveBeenNthCalledWith(4, setLoading);
    expect(onFunctions).toHaveBeenCalled();
    expect(onFields).not.toHaveBeenCalled();
    expect(onOperators).not.toHaveBeenCalled();
    expect(onValues).not.toHaveBeenCalled();
  });

  it('calls all suggested operand providers', () => {
    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {
        value: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
        function: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(dispatch).toHaveBeenCalledTimes(5);
    expect(dispatch).toHaveBeenNthCalledWith(1, appendOptionsForObservable);
    expect(dispatch).toHaveBeenNthCalledWith(2, appendOptionsForObservable);
    expect(dispatch).toHaveBeenNthCalledWith(3, onStartAutocompleteEvent);
    expect(dispatch).toHaveBeenNthCalledWith(4, setLoading);
    expect(dispatch).toHaveBeenNthCalledWith(5, setLoading);
    expect(onValues).toHaveBeenCalled();
    expect(onFunctions).toHaveBeenCalled();
    expect(onFields).not.toHaveBeenCalled();
    expect(onOperators).not.toHaveBeenCalled();
  });

  it(`doesn't call non-operand providers if EMPTY token is suggested`, () => {
    const thunk = actions.callAutocompleteProviders({
      tokens: emptyToken,
      rules: {
        field: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
        operator: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(dispatch).not.toHaveBeenCalled();
    expect(onFields).not.toHaveBeenCalled();
    expect(onOperators).not.toHaveBeenCalled();
  });

  it('prioritizes operand rules', () => {
    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {
        field: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
        operator: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
        value: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
        function: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(dispatch).toHaveBeenCalledTimes(5);
    expect(dispatch).toHaveBeenNthCalledWith(1, appendOptionsForObservable);
    expect(dispatch).toHaveBeenNthCalledWith(2, appendOptionsForObservable);
    expect(dispatch).toHaveBeenNthCalledWith(3, onStartAutocompleteEvent);
    expect(dispatch).toHaveBeenNthCalledWith(4, setLoading);
    expect(dispatch).toHaveBeenNthCalledWith(5, setLoading);
    expect(onValues).toHaveBeenCalled();
    expect(onFunctions).toHaveBeenCalled();
    expect(onFields).not.toHaveBeenCalled();
    expect(onOperators).not.toHaveBeenCalled();
  });

  it('calls onStopAutocompleteEvent with correct arguments when observable returns options', () => {
    appendOptionsForObservable.mockReturnValue(of(mockValues));

    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {
        value: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
        function: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(onStopAutocompleteEvent).toHaveBeenCalledWith(
      true,
      ['values', 'functions'],
      true,
    );
  });

  it('calls onStopAutocompleteEvent with correct arguments when observable returns no data', () => {
    appendOptionsForObservable.mockReturnValue(empty());

    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {
        value: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
        function: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(onStopAutocompleteEvent).toHaveBeenCalledWith(
      true,
      ['values', 'functions'],
      false,
    );
  });

  it('calls onStopAutocompleteEvent with correct arguments when observable returns an error', () => {
    appendOptionsForObservable.mockReturnValue(_throw('Something went wrong'));

    const thunk = actions.callAutocompleteProviders({
      tokens: noTokens,
      rules: {
        value: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
        function: {
          context: null,
          matchedText: '',
          replacePosition: [0, 0],
        },
      },
    });

    thunk({ getState, setState, dispatch });

    expect(onStopAutocompleteEvent).toHaveBeenCalledWith(
      false,
      ['values', 'functions'],
      false,
    );
  });
});

describe('appendOptionsForObservable', () => {
  const values$ = from([mockValues]);

  const valueRule: JQLRuleSuggestion = {
    context: {
      isList: true,
    },
    matchedText: 'test',
    replacePosition: [7, 24],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(actions, 'setLoading').mockReturnValue(setLoading);
  });

  it('generates correct shape for rule suggestions', () => {
    const thunk = actions.appendOptionsForObservable(
      'values',
      values$,
      valueRule,
      'value',
    );

    const observable = thunk({ getState, setState, dispatch });
    observable.subscribe();

    const mappedValues = mockValues.map(value => ({
      ...value,
      ...valueRule,
      type: 'value',
      id: getAutocompleteOptionId(value.value),
    }));

    expect(setState).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledWith({
      autocomplete: {
        ...initialState.autocomplete,
        options: {
          ...initialState.autocomplete.options,
          values: mappedValues,
        },
      },
    });
  });
});

describe('externalErrorMessageViewed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not fire an analytics event when there are no external errors', () => {
    const thunk = actions.externalErrorMessageViewed();

    const createAndFireAnalyticsEvent = jest.fn();
    const externalMessages: ExternalError[] = [];
    const containerProps = {
      createAndFireAnalyticsEvent,
      externalMessages,
    } as unknown as Props;
    thunk({ getState, setState, dispatch }, containerProps);

    expect(createAndFireAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('fires an analytics event with correct attributes when there are external errors', () => {
    const thunk = actions.externalErrorMessageViewed();
    getState.mockReturnValue({
      ...stateWithProviders,
      jqlError: new JQLParseError('client side error'),
    });

    const createAndFireAnalyticsEvent = jest.fn();
    const externalMessages: ExternalError[] = [
      {
        type: 'error',
        message: `The value 'ABC' does not exist for the field 'project'.`,
      },
      {
        type: 'error',
        message: `Error in the JQL Query: A function name cannot be empty. (line 1, character 7)`,
        errorType: 'EMPTY_FUNCTION',
      },
      {
        type: 'error',
        message: `Error in the JQL Query: A field name cannot be empty. (line 1, character 1)`,
        errorType: 'EMPTY_FIELD',
      },
    ];
    const containerProps = {
      createAndFireAnalyticsEvent,
      externalMessages,
    } as unknown as Props;
    thunk({ getState, setState, dispatch }, containerProps);

    expect(createAndFireAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        attributes: {
          hasClientError: true,
          semanticErrorCount: 1,
          syntaxErrorCount: 2,
          syntaxErrorTypes: ['EMPTY_FIELD', 'EMPTY_FUNCTION'],
        },
      }),
    );
  });
});
