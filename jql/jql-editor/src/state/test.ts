import { type StoreActionApi } from 'react-sweet-state';
import { empty } from 'rxjs/observable/empty';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Subscription } from 'rxjs/Subscription';

import { Schema } from '@atlaskit/editor-prosemirror/model';
import { EditorState, NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { JQLParseError } from '@atlaskit/jql-ast/jql-parse-error';
import type {
	JQLRuleSuggestion,
	JQLSuggestions,
} from '@atlaskit/jql-autocomplete/jql-autocomplete/types';
import type { AutocompleteOptions } from '@atlaskit/jql-editor-common/autocomplete/types';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { JQLEditorSchema } from '../schema';
import * as analyticsActionsModule from './analytics';
import { getAutocompleteOptionId } from './getAutocompleteOptionId';
import { actions, initialState } from './index';
import { type ExternalError, type Props, type State } from './types';

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
const dispatch: StoreActionApi<State>['dispatch'] = jest.fn((thunk) =>
	thunk({ getState, setState, dispatch }, undefined),
);
const onFields = jest.fn(() => empty<AutocompleteOptions>());
const onOperators = jest.fn(() => empty<AutocompleteOptions>());
const onValues = jest.fn(() => empty<AutocompleteOptions>());
const onFunctions = jest.fn(() => empty<AutocompleteOptions>());
const onFunctionArguments = jest.fn(() => empty<AutocompleteOptions>());
const appendOptionsForObservable = jest.fn(() => empty<AutocompleteOptions>());
const callAutocompleteProviders = jest.fn();
const cancelSubscription = jest.fn();
const setLoading = jest.fn();

const analyticsSubscription = new Subscription();
const onStopAutocompleteEvent = jest.fn();
const onStartAutocompleteEvent = jest.fn<analyticsActionsModule.AutocompleteEvent, []>(() => {
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
		onFunctionArguments,
	},
};

describe('opening rich node suggestions', () => {
	const pickerTypes = ['goal', 'project', 'focusArea'] as const;
	// Focus-area rendering lands separately; exercise its token type in a test-only schema.
	const schema = new Schema({
		nodes: JQLEditorSchema.spec.nodes.addToEnd(
			'focusArea',
			JQLEditorSchema.spec.nodes.get('goal')!,
		),
		marks: JQLEditorSchema.spec.marks,
	});
	const createEditor = (type: 'goal' | 'project' | 'focusArea' | 'team' = 'goal', space = ' ') => {
		const fieldName = {
			goal: 'Goals[Goals]',
			project: 'Project[AtlassianProject]',
			focusArea: 'Focus Areas[FocusAreas]',
			team: 'team',
		}[type];
		const prefix = `"${fieldName}" =${space}`;
		const node = schema.nodes[type].create(
			{ id: '123', name: 'Example', fieldName },
			schema.text('123'),
		);
		const doc = schema.nodes.doc.create(
			undefined,
			schema.nodes.paragraph.create(undefined, [schema.text(prefix), node]),
		);
		const nodePos = prefix.length + 1;
		let state: State = {
			...initialState,
			query: `${prefix}123`,
			editorState: EditorState.create({ schema, doc }),
		};
		const store: StoreActionApi<State> = {
			getState: () => state,
			setState: (update) => {
				state = { ...state, ...update };
			},
			dispatch: (action) => action(store, {} as Props),
		};
		jest.spyOn(actions, 'configurePlugins').mockReturnValue(() => {});
		actions.initialiseEditorView(
			document.createElement('div'),
			{},
			{
				onCreatePortal: jest.fn(),
				onDestroyPortal: jest.fn(),
				onRegisterPluginContainer: jest.fn(),
			},
		)(store, {} as Props);
		const view = state.editorView!;
		const click = () =>
			view.props.handleClickOn!(view, nodePos, node, nodePos, new MouseEvent('click'), true);
		return { view, store, nodePos, click, fieldName, prefix };
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each(pickerTypes)(
		'reopens suggestions for %s, including when it is already selected',
		(type) => {
			mockExpEnabled('focus_in_jira_m1');
			mockExpDisabled('anip-1095-goals-in-harmonised-filter');
			const { view, store, nodePos, click } = createEditor(type);
			const suggestions = jest
				.spyOn(actions, 'getAutocompleteSuggestions')
				.mockReturnValue(() => {});
			try {
				for (let attempt = 0; attempt < 2; attempt++) {
					actions.closeAutocomplete()(store);
					expect(click()).toBe(true);
					expect(view.state.selection).toEqual(NodeSelection.create(view.state.doc, nodePos));
					expect(store.getState().autocomplete.shouldStayClosedOnNextUpdate).toBe(false);
					expect(suggestions).toHaveBeenLastCalledWith(view.state);
				}
				expect(suggestions).toHaveBeenCalledTimes(2);
			} finally {
				view.destroy();
			}
		},
	);

	it.each(pickerTypes.flatMap((type) => [' ', ''].map((space) => ({ type, space }))))(
		'opens $type alternatives with ArrowDown with "$space" after the operator',
		({ type, space }) => {
			mockExpEnabled('focus_in_jira_m1');
			failGate('enable-jql-membersof-autocomplete');
			const { view, store, nodePos, fieldName, prefix } = createEditor(type, space);
			const providers = jest.spyOn(actions, 'callAutocompleteProviders').mockReturnValue(() => {});
			document.body.appendChild(view.dom);
			try {
				view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
				view.focus();
				const selection = view.state.selection;
				// Reopening after dismissal must work without changing the selected token.
				for (let attempt = 0; attempt < 2; attempt++) {
					actions.closeAutocomplete()(store);
					const event = new KeyboardEvent('keydown', {
						key: 'ArrowDown',
						bubbles: true,
						cancelable: true,
					});
					view.dom.dispatchEvent(event);
					expect(event.defaultPrevented).toBe(true);
					expect(store.getState().autocomplete.shouldStayClosed).toBe(false);
					expect(view.state.selection.eq(selection)).toBe(true);
					expect(view.hasFocus()).toBe(true);
					expect(store.getState().query).toBe(`${prefix}123`);
					expect(providers).toHaveBeenLastCalledWith(
						expect.objectContaining({
							rules: expect.objectContaining({
								value: expect.objectContaining({
									matchedText: '',
									replacePosition: [prefix.length, prefix.length + 3],
									context: expect.objectContaining({ field: `"${fieldName}"` }),
								}),
							}),
						}),
					);
				}
				// Let the autocomplete plugin navigate options once the menu is open.
				const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
				view.dom.dispatchEvent(event);
				expect(event.defaultPrevented).toBe(false);
				expect(providers).toHaveBeenCalledTimes(2);
			} finally {
				view.destroy();
			}
		},
	);

	it.each([
		{ type: 'goal', enabled: false, selected: true, key: 'ArrowDown' },
		{ type: 'team', enabled: true, selected: true, key: 'ArrowDown' },
		{ type: 'goal', enabled: true, selected: false, key: 'ArrowDown' },
		{ type: 'goal', enabled: true, selected: true, key: 'Escape' },
		{ type: 'goal', enabled: true, selected: true, key: 'Enter' },
		{ type: 'goal', enabled: true, selected: true, key: 'Tab' },
		{ type: 'goal', enabled: true, selected: true, key: 'ArrowLeft' },
		{ type: 'goal', enabled: true, selected: true, key: 'ArrowDown', shiftKey: true },
	] as const)(
		'leaves other keyboard interactions unchanged: %j',
		({ type, enabled, selected, ...keys }) => {
			if (enabled) {
				mockExpEnabled('focus_in_jira_m1');
			} else {
				mockExpDisabled('focus_in_jira_m1');
			}
			const { view, store, nodePos } = createEditor(type);
			const suggestions = jest
				.spyOn(actions, 'getAutocompleteSuggestions')
				.mockReturnValue(() => {});
			try {
				if (selected) {
					view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
				}
				suggestions.mockClear();
				const event = new KeyboardEvent('keydown', { ...keys, cancelable: true });
				view.dom.dispatchEvent(event);
				expect(event.defaultPrevented).toBe(false);
				expect(store.getState().autocomplete.shouldStayClosedOnNextUpdate).toBe(true);
				expect(suggestions).not.toHaveBeenCalled();
			} finally {
				view.destroy();
			}
		},
	);

	it.each(pickerTypes.flatMap((type) => [' ', ''].map((space) => ({ type, space }))))(
		'requests $type alternatives with "$space" after the operator',
		({ type, space }) => {
			mockExpEnabled('focus_in_jira_m1');
			failGate('enable-jql-membersof-autocomplete');
			const { view, click, fieldName, prefix } = createEditor(type, space);
			const providers = jest.spyOn(actions, 'callAutocompleteProviders').mockReturnValue(() => {});
			try {
				click();
				expect(providers).toHaveBeenCalledWith(
					expect.objectContaining({
						rules: expect.objectContaining({
							value: expect.objectContaining({
								matchedText: '',
								replacePosition: [prefix.length, prefix.length + 3],
								context: expect.objectContaining({ field: `"${fieldName}"` }),
							}),
						}),
					}),
				);
			} finally {
				view.destroy();
			}
		},
	);

	it.each(pickerTypes)('preserves existing %s behavior when the experiment is disabled', (type) => {
		mockExpDisabled('focus_in_jira_m1');
		failGate('enable-jql-membersof-autocomplete');
		const { view, click, store, nodePos } = createEditor(type, '');
		const providers = jest.spyOn(actions, 'callAutocompleteProviders').mockReturnValue(() => {});
		try {
			expect(click()).toBe(false);
			expect(store.getState().autocomplete.shouldStayClosedOnNextUpdate).toBe(true);
			actions.openAutocompleteOnNextUpdate()(store);
			view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
			expect(providers).toHaveBeenCalledWith(
				expect.objectContaining({
					rules: expect.objectContaining({
						operator: expect.objectContaining({ matchedText: '=' }),
					}),
				}),
			);
		} finally {
			view.destroy();
		}
	});

	it('preserves existing team behavior', () => {
		mockExpEnabled('focus_in_jira_m1');
		const { view, click, store } = createEditor('team');
		try {
			expect(click()).toBe(false);
			expect(store.getState().autocomplete.shouldStayClosedOnNextUpdate).toBe(true);
		} finally {
			view.destroy();
		}
	});
});

describe('getAutocompleteOptions', () => {
	const suggestions = {
		tokens: multipleTokens,
		rules: {},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		jest.spyOn(actions, 'callAutocompleteProviders').mockReturnValue(callAutocompleteProviders);
		jest.spyOn(actions, 'cancelSubscription').mockReturnValue(cancelSubscription);
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
		jest.spyOn(actions, 'appendOptionsForObservable').mockReturnValue(appendOptionsForObservable);
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
			undefined,
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
			undefined,
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
			undefined,
		);
	});

	describe('function argument suggestions', () => {
		it('calls onStopAutocompleteEvent with the enclosing function name when observable returns options', () => {
			passGate('enable-jql-membersof-autocomplete');
			appendOptionsForObservable.mockReturnValue(of(mockValues));

			const thunk = actions.callAutocompleteProviders({
				tokens: noTokens,
				rules: {
					functionArgument: {
						context: {
							field: 'team',
							functionName: 'descendantsofteam',
						},
						matchedText: '',
						replacePosition: [0, 0],
					},
				},
			});

			thunk({ getState, setState, dispatch });

			expect(onStopAutocompleteEvent).toHaveBeenCalledWith(
				true,
				['values'],
				true,
				'descendantsofteam',
			);
		});

		it('calls onStopAutocompleteEvent with the enclosing function name when observable returns an error', () => {
			passGate('enable-jql-membersof-autocomplete');
			appendOptionsForObservable.mockReturnValue(_throw('Something went wrong'));

			const thunk = actions.callAutocompleteProviders({
				tokens: noTokens,
				rules: {
					functionArgument: {
						context: {
							field: 'team',
							functionName: 'descendantsofteam',
						},
						matchedText: '',
						replacePosition: [0, 0],
					},
				},
			});

			thunk({ getState, setState, dispatch });

			expect(onStopAutocompleteEvent).toHaveBeenCalledWith(
				false,
				['values'],
				false,
				'descendantsofteam',
			);
		});

		it('calls onStopAutocompleteEvent without a function name when the parse context has none', () => {
			passGate('enable-jql-membersof-autocomplete');
			appendOptionsForObservable.mockReturnValue(of(mockValues));

			const thunk = actions.callAutocompleteProviders({
				tokens: noTokens,
				rules: {
					functionArgument: {
						context: {
							field: 'team',
						},
						matchedText: '',
						replacePosition: [0, 0],
					},
				},
			});

			thunk({ getState, setState, dispatch });

			expect(onStopAutocompleteEvent).toHaveBeenCalledWith(true, ['values'], true, undefined);
		});
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
		const thunk = actions.appendOptionsForObservable('values', values$, valueRule, 'value');

		const observable = thunk({ getState, setState, dispatch });
		observable.subscribe();

		const mappedValues = mockValues.map((value) => ({
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
