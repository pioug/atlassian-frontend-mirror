import { type FocusEvent, type MouseEvent } from 'react';

import clamp from 'lodash/clamp';
import groupBy from 'lodash/groupBy';
import { createIntl, type IntlShape } from 'react-intl-next';
import {
	type Action,
	createContainer,
	createHook,
	createSelector,
	createStore,
} from 'react-sweet-state';
import { type Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { tap } from 'rxjs/operators/tap';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidv4 } from 'uuid';

import { type EditorState, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { computeJqlInsights, isListOperator, type JQLParseError } from '@atlaskit/jql-ast';
import { JQLAutocomplete, type JQLRuleSuggestion } from '@atlaskit/jql-autocomplete';

import {
	ActionSubject,
	ActionSubjectId,
	Action as AnalyticsAction,
	EventType,
	type JqlEditorAnalyticsEvent,
} from '../analytics';
import { selectErrorCommand } from '../commands/select-error-command';
import { JQL_EDITOR_MAIN_ID } from '../common/constants';
import {
	type AutocompleteOptionGroup,
	type AutocompleteOptions,
	type AutocompleteOptionType,
	type SelectableAutocompleteOption,
	type SelectableAutocompleteOptions,
} from '../plugins/autocomplete/components/types';
import {
	defaultAutocompleteProvider,
	JQLAutocompletePluginKey,
} from '../plugins/autocomplete/constants';
import { getJastFromState } from '../plugins/jql-ast';
import { type AutocompleteProvider } from '../plugins/types';
import {
	clipboardTextParser,
	clipboardTextSerializer,
	configurePlugins,
	defaultEditorState,
	type JQLEditorCommand,
} from '../schema';
import { type PortalActions } from '../ui/jql-editor-portal-provider/types';
import {
	type HydratedDeprecatedField,
	type HydratedProject,
	type HydratedTeam,
	type HydratedUser,
	type HydratedValue,
} from '../ui/jql-editor/types';
import { getNodeText } from '../utils/document-text';

import { onStartAutocompleteEvent } from './analytics';
import { sortOperators } from './autocomplete';
import { hydrateQuery } from './hydration';
import {
	type AutocompletePosition,
	type AutocompleteState,
	type ContextAwareJQLSuggestions,
	type CustomErrorComponent,
	type ExternalError,
	type ExternalErrorAttributes,
	type ExternalMessage,
	type ExternalMessagesNormalized,
	type OptionsKey,
	type Props,
	type State,
} from './types';
import {
	getAutocompleteOptionId,
	getAutocompletePosition,
	getFieldNodes,
	getReplacePositionStart,
	sendDebugMessage,
	tokensToAutocompleteOptions,
} from './util';

const initialIntl = createIntl({ locale: 'en' });

const defaultAutocompleteOptions: AutocompleteOptionGroup = {
	tokens: [],
	fields: [],
	operators: [],
	values: [],
	functions: [],
};

type Actions = typeof actions;

export const initialState: State = {
	controlledQuery: '',
	query: '',
	externalMessages: [],
	isSearching: undefined,
	editorState: defaultEditorState,
	editorView: undefined,
	intlRef: { current: initialIntl },
	autocompleteProvider: defaultAutocompleteProvider,
	idPrefix: '',
	editorViewHasFocus: false,
	editorViewBlurTimeout: null,
	lineNumbersVisible: false,
	jqlError: null,
	autocomplete: {
		// Keep autocomplete closed until user modifies query
		shouldStayClosedOnNextUpdate: true,
		shouldStayClosed: true,
		selectedOptionId: undefined,
		loading: false,
		options: defaultAutocompleteOptions,
		subscription: null,
		analyticsSubscription: null,
		container: null,
		offsetParentRect: undefined,
		replacePositionStart: 0,
	},
	enableRichInlineNodes: false,
	hydratedValues: {},
	resizeObserver: undefined,
	editorViewContainer: undefined,
	editorViewContainerRect: undefined,
	editorViewContainerScroll: 0,
	onDebugUnsafeMessage: undefined,
};

/**
 * Line numbers should be shown if there are more than 1 paragraph blocks in the document.
 */
const isLineNumbersVisible = (editorState: EditorState) => editorState.doc.childCount > 1;

export const actions = {
	onEditorViewBlur:
		(): Action<State> =>
		({ setState, dispatch }) => {
			// Set editorViewHasFocus within a timeout, to handle the scenario where a dropdown option is clicked. Without the
			// timeout, a blur event would be fired for the editor on mousedown, which would cause the dropdown to be hidden
			// before the click event is fired.
			const editorViewBlurTimeout = window.setTimeout(() => {
				setState({
					editorViewHasFocus: false,
				});
				dispatch(actions.setSelectedAutocompleteOptionId(undefined));
			});
			setState({
				editorViewBlurTimeout,
			});
		},

	onEditorViewFocus:
		(event: FocusEvent<HTMLElement>): Action<State, Props> =>
		({ setState, getState }, { onFocus }) => {
			const { autocomplete, editorViewBlurTimeout, editorViewHasFocus } = getState();
			editorViewBlurTimeout && clearTimeout(editorViewBlurTimeout);
			if (!editorViewHasFocus) {
				setState({
					autocomplete: {
						...autocomplete,
						// This is a performance optimization to avoid querying this rect on every autocomplete dropdown render.
						// We assume that autocomplete offset parent rect is not going to change while user interacts with the editor,
						// so we only recompute this on focus.
						offsetParentRect: autocomplete.container?.offsetParent?.getBoundingClientRect(),
					},
					editorViewHasFocus: true,
				});
				onFocus && onFocus(event);
			}
		},

	openAutocompleteOnNextUpdate:
		(): Action<State> =>
		({ setState, getState }) => {
			const autocompleteState = getState().autocomplete;
			setState({
				autocomplete: {
					...autocompleteState,
					// Schedule open for next update of autocomplete suggestions so dropdown doesn't incur in layout shifts
					shouldStayClosedOnNextUpdate: false,
				},
			});
		},

	closeAutocomplete:
		(): Action<State> =>
		({ setState, getState }) => {
			const autocompleteState = getState().autocomplete;
			setState({
				autocomplete: {
					...autocompleteState,
					// Closing autocomplete can be done immediately as it won't incur in layout shifts
					shouldStayClosed: true,
					shouldStayClosedOnNextUpdate: true,
				},
			});
		},

	setSelectedAutocompleteOptionId:
		(selectedOptionId: string | undefined): Action<State> =>
		({ setState, getState }) => {
			const autocompleteState = getState().autocomplete;
			setState({
				autocomplete: {
					...autocompleteState,
					selectedOptionId,
				},
			});
		},

	getAutocompleteSuggestions:
		(editorState: EditorState): Action<State> =>
		({ getState, dispatch }) => {
			// No need to process suggestions if autocomplete is going to stay closed on next update
			if (!getState().autocomplete.shouldStayClosedOnNextUpdate) {
				const { from, to } = editorState.selection;
				const text = getNodeText(editorState.doc, 0, editorState.doc.content.size);
				const textBeforeSelectionStart = getNodeText(editorState.doc, 0, from);
				const textBeforeSelectionEnd = getNodeText(editorState.doc, 0, to);
				const textPositionStart = textBeforeSelectionStart.length;
				const textPositionStop = textBeforeSelectionEnd.length;

				const autocomplete = JQLAutocomplete.fromText(text);

				const suggestions = autocomplete.getJQLSuggestionsForCaretPosition([
					textPositionStart,
					textPositionStop,
				]);

				const { rules, tokens } = suggestions as ContextAwareJQLSuggestions;

				// In some situations (e.g. "issuetype in "), autocomplete expects a list, but we want to display operands
				// to the user as a shortcut – so they don't have to manually type the opening parenthesis. There is logic
				// on autocomplete option selection that will auto-insert this opening parenthesis.
				if (rules.list && rules.list.context && !rules.list.context.isList) {
					if (!tokens.values.includes('EMPTY')) {
						tokens.values.push('EMPTY');
						tokens.context = rules.list.context;
					}

					if (!rules.value) {
						rules.value = rules.list;
					}

					if (!rules.function) {
						rules.function = rules.list;
					}
				}

				dispatch(actions.getAutocompleteOptions(suggestions));
			}
		},

	getAutocompleteOptions:
		(suggestions: ContextAwareJQLSuggestions): Action<State> =>
		({ setState, getState, dispatch }) => {
			const { autocomplete, editorView } = getState();
			const { shouldStayClosedOnNextUpdate } = autocomplete;
			setState({
				autocomplete: {
					...autocomplete,
					options: {
						...defaultAutocompleteOptions,
						tokens: tokensToAutocompleteOptions(suggestions.tokens),
					},
					// Set replace position start in the same update as initial options to avoid visible layout shifts
					...(editorView && {
						replacePositionStart: getReplacePositionStart(suggestions),
					}),
					// Update autocomplete visibility in the same update as initial options to avoid visible layout shifts
					shouldStayClosed: shouldStayClosedOnNextUpdate,
				},
			});
			dispatch(actions.cancelSubscription());
			dispatch(actions.callAutocompleteProviders(suggestions));
		},

	appendOptionsForObservable:
		(
			key: OptionsKey,
			observable: Observable<AutocompleteOptions>,
			rule: JQLRuleSuggestion,
			type: AutocompleteOptionType,
		): Action<State, void, Observable<AutocompleteOptions>> =>
		({ getState, setState }) => {
			const { context, matchedText, replacePosition } = rule;
			return observable.pipe(
				tap((data) => {
					const nextSuggestions: SelectableAutocompleteOptions = data.map((option) => ({
						...option,
						context,
						matchedText,
						replacePosition,
						type,
						id: getAutocompleteOptionId(option.value),
					}));

					const { autocomplete } = getState();
					const { options } = autocomplete;
					setState({
						autocomplete: {
							...autocomplete,
							options: {
								...options,
								[key]: options[key].concat(nextSuggestions),
							},
						},
					});
				}),
			);
		},

	cancelSubscription:
		(): Action<State> =>
		({ setState, getState }) => {
			const autocompleteState = getState().autocomplete;
			const { subscription, analyticsSubscription } = autocompleteState;
			// Cancel any in-flight subscriptions
			subscription && subscription.unsubscribe();
			analyticsSubscription && analyticsSubscription.unsubscribe();

			setState({
				autocomplete: {
					...autocompleteState,
					subscription: null,
					analyticsSubscription: null,
					// Setting loading back to false on unsubscribe as this won't call error or complete callbacks
					// in the observer, and we don't seem to have any other way to handle this from the observer itself
					loading: false,
				},
			});
		},

	setLoading:
		(loading: boolean): Action<State> =>
		({ setState, getState }) => {
			const { autocomplete } = getState();
			setState({
				autocomplete: {
					...autocomplete,
					loading,
				},
			});
		},

	setAutocompleteOptions:
		(options: AutocompleteOptionGroup): Action<State> =>
		({ setState, getState }) => {
			const autocompleteState = getState().autocomplete;
			setState({
				autocomplete: {
					...autocompleteState,
					options,
				},
			});
		},

	setAutocompleteContainer:
		(container: HTMLElement | null): Action<State> =>
		({ setState, getState }) => {
			const autocompleteState = getState().autocomplete;
			setState({
				autocomplete: {
					...autocompleteState,
					container,
					offsetParentRect: container?.offsetParent?.getBoundingClientRect(),
				},
			});
		},

	callAutocompleteProviders:
		({ rules, tokens }: ContextAwareJQLSuggestions): Action<State> =>
		({ getState, setState, dispatch }) => {
			const { onFields, onOperators, onValues, onFunctions } = getState().autocompleteProvider;

			const optionTypes: OptionsKey[] = [];
			const observables: Observable<AutocompleteOptions>[] = [];

			if (
				rules.value ||
				rules.function ||
				// If EMPTY is suggested as a token, we are also in "operand mode" and we don't want to call other providers
				// e.g. "assignee is " will return "EMPTY" token and "operator" rule as suggestions (because of "is not")
				tokens.values.includes('EMPTY')
			) {
				if (rules.value) {
					const values$ = onValues(rules.value.matchedText, rules.value.context?.field);
					optionTypes.push('values');
					observables.push(
						dispatch(actions.appendOptionsForObservable('values', values$, rules.value, 'value')),
					);
				}
				if (rules.function) {
					const functions$ = onFunctions(
						rules.function.matchedText,
						rules.function.context?.field,
						rules.function.context?.operator
							? isListOperator(rules.function.context.operator)
							: false,
					);
					optionTypes.push('functions');
					observables.push(
						dispatch(
							actions.appendOptionsForObservable(
								'functions',
								functions$,
								rules.function,
								'function',
							),
						),
					);
				}
			} else if (rules.operator) {
				const { context, matchedText } = rules.operator;
				const operators$ = sortOperators(onOperators(matchedText, context?.field));
				optionTypes.push('operators');
				observables.push(
					dispatch(
						actions.appendOptionsForObservable('operators', operators$, rules.operator, 'operator'),
					),
				);
			} else if (rules.field) {
				const { context, matchedText } = rules.field;
				const fields$ = onFields(matchedText, context?.clause);
				optionTypes.push('fields');
				observables.push(
					dispatch(actions.appendOptionsForObservable('fields', fields$, rules.field, 'field')),
				);
			}

			if (observables.length === 0) {
				return;
			}

			const { analyticsSubscription, onStopAutocompleteEvent } = dispatch(
				onStartAutocompleteEvent(),
			);

			dispatch(actions.setLoading(true));

			let hasOptions = false;
			const subscription = merge(...observables).subscribe({
				next() {
					hasOptions = true;
				},
				error() {
					onStopAutocompleteEvent(false, optionTypes, hasOptions);
					dispatch(actions.setLoading(false));
				},
				complete() {
					onStopAutocompleteEvent(true, optionTypes, hasOptions);
					dispatch(actions.setLoading(false));
				},
			});

			const { autocomplete } = getState();
			setState({
				autocomplete: {
					...autocomplete,
					subscription,
					analyticsSubscription,
				},
			});
		},

	updateValidationState:
		(): Action<State> =>
		({ getState, setState }) => {
			const { editorState } = getState();

			const jast = getJastFromState(editorState);
			setState({
				jqlError: jast.errors.length > 0 ? jast.errors[0] : null,
			});
		},

	initialiseEditorState:
		(): Action<State, Props> =>
		({ dispatch }, { query }) => {
			// Configure plugins that don't require portal rendering (these will be reconfigured later when the editor view is mounted).
			dispatch(actions.configurePlugins(undefined));
			dispatch(actions.resetEditorState(query, false));
		},

	configurePlugins:
		(portalActions: PortalActions | void): Action<State, Props> =>
		({ getState, setState, dispatch }, { intlRef, onSearch }) => {
			const state = getState();
			let { editorState } = state;
			const { enableRichInlineNodes } = state;

			// Initialise our editor using inline functions which will delegate to our sweet state actions. This prevents
			// stale references when our functions are invoked by Prosemirror.
			const onSearchCommand: JQLEditorCommand = (pmState, pmDispatch, pmView) =>
				// Set keyboardShortcut arg to true as this action is invoked by the 'Enter' keyboard command
				dispatch(actions.onSearchCommand(pmState, pmDispatch, pmView, true));

			editorState = configurePlugins(
				editorState,
				onSearch ? onSearchCommand : undefined,
				intlRef,
				getScopedId(getState(), JQL_EDITOR_MAIN_ID),
				portalActions,
				enableRichInlineNodes,
			);

			setState({
				editorState,
			});
		},

	onApplyEditorTransaction:
		(transaction: Transaction): Action<State, Props> =>
		({ getState, setState, dispatch }, { onUpdate }) => {
			const { query, editorState, editorView, enableRichInlineNodes, onDebugUnsafeMessage } =
				getState();

			const oldSelection = editorState.selection;

			const updatedQuery = getNodeText(transaction.doc, 0, transaction.doc.content.size);

			let updatedEditorState;
			try {
				updatedEditorState = editorState.apply(transaction);
			} catch (error) {
				// We've observed several errors in Splunk from this step but we're unsure how to reproduce it. It seems to be some type of
				// race condition where the transaction is applied to the editor state but the editor state is being updated in another transaction.
				if (error instanceof RangeError && editorView) {
					const message = `Error occurred trying to update editor state with the message: ${error.message}`;
					sendDebugMessage(message, editorView, editorState, onDebugUnsafeMessage, {
						stack: error.stack,
						transaction: JSON.stringify(transaction),
					});
				}

				throw error;
			}

			// Update state in our editor view
			if (editorView) {
				editorView.updateState(updatedEditorState);
			}

			setState({
				query: updatedQuery,
				editorState: updatedEditorState,
				lineNumbersVisible: isLineNumbersVisible(updatedEditorState),
			});

			// Hydrate query if transaction has requested it or a query fragment has been pasted
			if (
				enableRichInlineNodes &&
				(transaction.getMeta('hydrate') || transaction.getMeta('paste'))
			) {
				void dispatch(hydrateQuery());
			}

			if (query !== updatedQuery && !transaction.getMeta(JQLAutocompletePluginKey)) {
				// Open autocomplete on next update if query has changed and update wasn't triggered internally
				dispatch(actions.openAutocompleteOnNextUpdate());
			}

			if (query !== updatedQuery || !updatedEditorState.selection.eq(oldSelection)) {
				// Get autocomplete suggestions for new editor state
				dispatch(actions.getAutocompleteSuggestions(updatedEditorState));
			}

			if (query !== updatedQuery) {
				// Only dispatch update event if query has changed
				onUpdate && onUpdate(updatedQuery, getJastFromState(updatedEditorState));
			}
		},

	resetEditorState:
		(query: string, addToHistory = true): Action<State> =>
		({ getState, dispatch }) => {
			const { editorState, enableRichInlineNodes } = getState();

			// Use the clipboard text parser to get our slice to ensure new lines are split into separate paragraphs
			const slice = clipboardTextParser(query, editorState.doc.resolve(0));

			const resetQueryTransaction = editorState.tr
				.setMeta('addToHistory', addToHistory)
				.replace(0, editorState.doc.content.size, slice);

			dispatch(actions.onApplyEditorTransaction(resetQueryTransaction));
			dispatch(actions.updateValidationState());

			if (enableRichInlineNodes) {
				void dispatch(hydrateQuery());
			}
		},

	initialiseEditorView:
		(
			editorViewNode: HTMLElement,
			attributes: { [key: string]: string },
			portalActions: PortalActions,
		): Action<State, Props> =>
		({ getState, setState, dispatch }, { onEditorMounted }) => {
			// Configure plugins that require portal rendering (i.e. autocomplete and rich inline nodes).
			dispatch(actions.configurePlugins(portalActions));

			const { editorState, resizeObserver } = getState();

			const editorView = new EditorView(editorViewNode, {
				state: editorState,
				dispatchTransaction: (transaction) =>
					dispatch(actions.onApplyEditorTransaction(transaction)),
				clipboardTextSerializer,
				clipboardTextParser,
				attributes,
			});

			// Unobserve previously observed elements
			resizeObserver?.disconnect();

			// Observe size changes to update rect
			resizeObserver?.observe(editorViewNode);

			setState({
				editorView,
			});

			onEditorMounted && onEditorMounted();
		},

	updateEditorView:
		(attributes: { [key: string]: string }): Action<State, Props> =>
		({ getState }) => {
			const { editorView, onDebugUnsafeMessage, editorState } = getState();
			if (editorView) {
				try {
					editorView.update({
						...editorView.props,
						attributes,
					});
				} catch (error) {
					// We've observed several errors from this step but we're unsure how to reproduce it. It seems to be some type of
					// race condition whether the view is being updated with a mismatched selection in the UI. We'll catch the error
					// so the UI doesn't break trying to change attributes and fire a callback to debug the error.
					const message = `Error occurred trying to update attributes on the editor view with the message: ${
						error instanceof Error ? error.message : String(error)
					}`;

					const attributeDiff = Object.keys(attributes).reduce((result, key) => {
						const prevAttr: string | null =
							// @ts-ignore
							editorView.props.attributes?.[key];
						const nextAttr: string = attributes[key];

						if (nextAttr !== prevAttr) {
							// @ts-ignore
							result[`prev_${key}`] = prevAttr;
							// @ts-ignore
							result[`next_${key}`] = nextAttr;
						}
						return result;
					}, {});

					sendDebugMessage(message, editorView, editorState, onDebugUnsafeMessage, {
						stack: error instanceof Error ? error.stack : '',
						...attributeDiff,
					});
				}
			}
		},

	setEditorViewContainer:
		(editorViewContainer: HTMLElement): Action<State> =>
		({ setState }) => {
			setState({
				editorViewContainer,
				// Set initial rect
				editorViewContainerRect: editorViewContainer?.getBoundingClientRect(),
			});
		},

	setEditorViewContainerScroll:
		(scroll: number): Action<State> =>
		({ setState }) => {
			setState({
				editorViewContainerScroll: scroll,
			});
		},

	onSearch:
		(): Action<State> =>
		({ getState, dispatch }) => {
			const { editorState, editorView } = getState();
			dispatch(
				// Set keyboardShortcut arg to false as this action is invoked directly by the search UI button
				actions.onSearchCommand(editorState, editorView?.dispatch, editorView, false),
			);
		},

	onSearchCommand:
		(
			pmState: EditorState,
			pmDispatch: ((tr: Transaction) => void) | undefined,
			pmView: EditorView | undefined,
			// Whether the search command was invoked via a keyboard shortcut
			keyboardShortcut: boolean,
		): Action<State, Props, boolean> =>
		({ getState, dispatch }, { onSearch, createAndFireAnalyticsEvent }) => {
			if (!onSearch) {
				return true;
			}

			const jast = getJastFromState(pmState);
			const { query } = getState();
			onSearch(query, jast);

			createAndFireAnalyticsEvent({
				action: AnalyticsAction.CLICKED,
				actionSubject: ActionSubject.BUTTON,
				actionSubjectId: ActionSubjectId.EDITOR_SEARCH,
				eventType: EventType.UI,
				attributes: {
					...computeJqlInsights(jast),
					keyboardShortcut,
				},
			});

			// Update JQL validation state
			dispatch(actions.updateValidationState());

			// Invoke command to select any errors in the query
			selectErrorCommand(pmState, pmDispatch, pmView);

			return true;
		},

	externalErrorMessageViewed:
		(): Action<State, Props> =>
		({ getState }, { createAndFireAnalyticsEvent, externalMessages }) => {
			const { editorView, onDebugUnsafeMessage, jqlError, editorState } = getState();

			const externalErrors = externalMessages.filter(
				({ type }) => type === 'error',
			) as ExternalError[];

			if (externalErrors.length > 0) {
				const hasClientError = jqlError !== null;
				const initialValue: ExternalErrorAttributes = {
					hasClientError,
					semanticErrorCount: 0,
					syntaxErrorCount: 0,
					syntaxErrorTypes: [],
				};

				const attributes = externalErrors.reduce((result, { errorType }) => {
					if (typeof errorType === 'string') {
						result.syntaxErrorCount++;
						result.syntaxErrorTypes.push(errorType);
					} else {
						result.semanticErrorCount++;
					}
					return result;
				}, initialValue);

				attributes.syntaxErrorTypes.sort();

				createAndFireAnalyticsEvent({
					action: AnalyticsAction.VIEWED,
					actionSubject: ActionSubject.ERROR_MESSAGE,
					actionSubjectId: ActionSubjectId.JQL_RESULT,
					eventType: EventType.UI,
					attributes,
				});

				// If we have JQL errors which have been externally provided but no errors in our JAST, then we may have gaps in
				// our client side validation. Let's monitor any errors we weren't expecting.
				if (editorView && !hasClientError && attributes.syntaxErrorCount > 0) {
					const message = 'External JQL syntax error is shown without a client error.';
					sendDebugMessage(message, editorView, editorState, onDebugUnsafeMessage, {
						syntaxErrorTypes: attributes.syntaxErrorTypes.join(','),
					});
				}
			}
		},

	createAndFireAnalyticsEvent:
		(payload: JqlEditorAnalyticsEvent): Action<State, Props> =>
		(_, { createAndFireAnalyticsEvent }) => {
			createAndFireAnalyticsEvent(payload);
		},
};

const Store = createStore<State, Actions>({
	name: 'jql-editor',
	initialState,
	actions,
});

export const useStoreActions = createHook<State, Actions, null>(Store, {
	selector: null,
});

export const useEditorState = createHook<State, Actions, EditorState>(Store, {
	selector: (state) => state.editorState,
});

export const useEditorView = createHook<State, Actions, EditorView | undefined>(Store, {
	selector: (state) => state.editorView,
});

export const useIsSearching = createHook<State, Actions, boolean | undefined>(Store, {
	selector: (state) => state.isSearching,
});

export const useIntl = createHook<State, Actions, IntlShape>(Store, {
	selector: (state) => state.intlRef.current,
});

export const useAutocompleteProvider = createHook<State, Actions, AutocompleteProvider>(Store, {
	selector: (state) => state.autocompleteProvider,
});

const getScopedId = (state: State, idSuffix: string): string => `${state.idPrefix}_${idSuffix}`;

export const useScopedId = createHook<State, Actions, string, string>(Store, {
	selector: getScopedId,
});

export const useIdPrefix = createHook<State, Actions, string>(Store, {
	selector: (state) => state.idPrefix,
});

export const useEditorViewHasFocus = createHook<State, Actions, boolean>(Store, {
	selector: ({ editorViewHasFocus }) => editorViewHasFocus,
});

export const useLineNumbersVisible = createHook<State, Actions, boolean>(Store, {
	selector: ({ lineNumbersVisible }) => lineNumbersVisible,
});

const getAutocomplete = (state: State): AutocompleteState => state.autocomplete;

export const useAutocomplete = createHook<State, Actions, AutocompleteState>(Store, {
	selector: getAutocomplete,
});

/**
 * Returns the JQL error from the last query that was searched, or {@code null} if there were none.
 */
export const useJqlError = createHook<State, Actions, JQLParseError | null>(Store, {
	selector: (state) => state.jqlError,
});

/**
 * Returns whether there are any JQL errors in the current Prosemirror editor state.
 */
export const useEditorStateHasJqlError = createHook<State, Actions, boolean>(Store, {
	selector: (state) => getJastFromState(state.editorState).errors.length > 0,
});

const memoizedExternalMessagesSelector = createSelector<
	State,
	void,
	ExternalMessagesNormalized,
	ExternalMessage[]
>(
	(state) => state.externalMessages,
	(externalMessages) => {
		const byType = groupBy(externalMessages, 'type');

		return {
			errors: byType.error || [],
			warnings: byType.warning || [],
			infos: byType.info || [],
		} as ExternalMessagesNormalized;
	},
);

export const useExternalMessages = createHook<State, Actions, ExternalMessagesNormalized>(Store, {
	selector: memoizedExternalMessagesSelector,
});

export const useCustomErrorComponent = createHook<State, Actions, CustomErrorComponent | undefined>(
	Store,
	{
		selector: (state) => {
			return state.customComponents?.ErrorMessage;
		},
	},
);

const memoizedAutocompleteOptionsSelector = createSelector<
	State,
	void,
	SelectableAutocompleteOption[],
	SelectableAutocompleteOptions,
	SelectableAutocompleteOptions,
	SelectableAutocompleteOptions,
	SelectableAutocompleteOptions,
	SelectableAutocompleteOptions
>(
	(state) => state.autocomplete.options.tokens,
	(state) => state.autocomplete.options.functions,
	(state) => state.autocomplete.options.values,
	(state) => state.autocomplete.options.operators,
	(state) => state.autocomplete.options.fields,
	(tokens, functions, values, operators, fields) => [
		...tokens,
		...functions,
		...values,
		...operators,
		...fields,
	],
);

export const useAutocompleteOptions = createHook<State, Actions, SelectableAutocompleteOption[]>(
	Store,
	{
		selector: memoizedAutocompleteOptionsSelector,
	},
);

const autocompleteIsLoadingSelector = (state: State): boolean => state.autocomplete.loading;

export const useAutocompleteLoading = createHook<State, Actions, boolean>(Store, {
	selector: autocompleteIsLoadingSelector,
});

const memoizedAutocompleteIsOpenSelector = createSelector<
	State,
	void,
	boolean,
	boolean,
	SelectableAutocompleteOption[],
	boolean,
	boolean
>(
	(state) => state.editorViewHasFocus,
	memoizedAutocompleteOptionsSelector,
	autocompleteIsLoadingSelector,
	(state) => state.autocomplete.shouldStayClosed,
	(hasFocus, options, loading, shouldStayClosed) =>
		!shouldStayClosed && hasFocus && (options.length > 0 || loading),
);

export const useAutocompleteIsOpen = createHook<State, Actions, boolean>(Store, {
	selector: memoizedAutocompleteIsOpenSelector,
});

export const useAutocompletePosition = createHook<State, Actions, AutocompletePosition>(Store, {
	selector: (state) => {
		const { autocomplete, editorView, editorViewContainerRect, onDebugUnsafeMessage, editorState } =
			state;
		const { replacePositionStart, offsetParentRect } = autocomplete;

		if (!editorView) {
			// Should never™ happen
			return { top: 0, left: 0 };
		}

		let docTop;
		let docLeft;
		try {
			const autocompletePosition = getAutocompletePosition(editorView, replacePositionStart);
			docTop = autocompletePosition.top;
			docLeft = autocompletePosition.left;
		} catch (error) {
			// We've observed several 'Invalid position: x' errors from this step but we're unsure how to reproduce it. It
			// seems to be some type of race condition whether the view is being updated with a mismatched selection in the
			// UI. We'll catch the error so the UI doesn't break and fire a callback to debug the error.
			const message = `Error occurred trying to get autocomplete position with the message: ${
				error instanceof Error ? error.message : String(error)
			}`;
			sendDebugMessage(message, editorView, editorState, onDebugUnsafeMessage, {
				stack: error instanceof Error ? error.stack : '',
			});

			// Fallback to showing autocomplete at bottom left of editor view if we were unable to calculate the position.
			docTop = editorViewContainerRect?.bottom ?? 0;
			docLeft = editorViewContainerRect?.left ?? 0;
		}

		// In some situations, we can get an autocompleteTop that exceeds editor view container top/bottom boundaries,
		// e.g. when editor content overflows editor view container and selection start/end is not visible. To prevent
		// situations where autocomplete dropdown greatly overflows editor view container, we clamp this position.
		// We also offset top position returned by ProseMirror to ensure autocomplete is positioned consistently at
		// a grid size distance from editor input bottom in all situations where autocomplete is outside of the editor.
		const autocompleteTop = docTop;
		const viewportTop =
			editorViewContainerRect !== undefined
				? clamp(autocompleteTop, editorViewContainerRect.top, editorViewContainerRect.bottom)
				: autocompleteTop;

		const left = docLeft - (offsetParentRect?.left ?? 0);
		const top = viewportTop - (offsetParentRect?.top ?? 0);

		return { left, top };
	},
});

export const useHydratedValue = createHook<
	State,
	Actions,
	HydratedValue | undefined,
	{ fieldName: string; id: string }
>(Store, {
	selector: (state, { id, fieldName }) => {
		return state.hydratedValues[fieldName]?.get(id);
	},
});

export const useHydratedUser = createHook<
	State,
	Actions,
	HydratedUser | undefined,
	{ fieldName: string; id: string }
>(Store, {
	selector: (state, { id, fieldName }) => {
		const user = state.hydratedValues[fieldName]?.get(id);
		return user && user.type === 'user' ? user : undefined;
	},
});

export const useHydratedTeam = createHook<
	State,
	Actions,
	HydratedTeam | undefined,
	{ fieldName: string; id: string }
>(Store, {
	selector: (state, { id, fieldName }) => {
		const team = state.hydratedValues[fieldName]?.get(id);
		return team && team.type === 'team' ? team : undefined;
	},
});

export const useHydratedProject = createHook<
	State,
	Actions,
	HydratedProject | undefined,
	{ fieldName: string; id: string }
>(Store, {
	selector: (state, { id, fieldName }) => {
		const project = state.hydratedValues[fieldName]?.get(id);
		return project && project.type === 'project' ? project : undefined;
	},
});

export const useHydratedDeprecations = createHook<State, Actions, HydratedDeprecatedField[]>(
	Store,
	{
		selector: (state) => {
			const ast = getJastFromState(state.editorState);
			const fieldsInQuery = getFieldNodes(ast);

			const toReturn: HydratedDeprecatedField[] = [];

			Object.entries(state.hydratedValues).forEach(([fieldName]) => {
				state.hydratedValues[fieldName]?.forEach((value: HydratedValue) => {
					if (value.type === 'deprecated-field') {
						if (fieldsInQuery.has(value.id.toLowerCase())) {
							toReturn.push(value);
						}
					}
				});
			});
			return toReturn;
		},
	},
);

export const useRichInlineNodesEnabled = createHook<State, Actions, boolean>(Store, {
	selector: (state) => state.enableRichInlineNodes,
});

export const useOnSyntaxHelp = createHook<
	State,
	Actions,
	((e: MouseEvent<HTMLElement>) => boolean) | void
>(Store, {
	selector: (state) => state.onSyntaxHelp,
});

export const EditorStateContainer = createContainer<State, Actions, Props>(Store, {
	onInit:
		() =>
		(
			{ getState, setState, dispatch },
			{
				intlRef,
				query,
				isSearching,
				autocompleteProvider,
				externalMessages,
				enableRichInlineNodes,
				onDebugUnsafeMessage,
				onSyntaxHelp,
				customComponents,
			},
		) => {
			setState({
				controlledQuery: query,
				query,
				externalMessages,
				isSearching,
				intlRef,
				autocompleteProvider,
				enableRichInlineNodes,
				// Generate unique identifiers for each JQL editor instance
				// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
				idPrefix: uuidv4(),
				resizeObserver:
					window.ResizeObserver !== undefined
						? new window.ResizeObserver(() => {
								setState({
									// We assume editor view container is the only element using the observer to avoid extra processing.
									// If this instance is reused to observe more elements (which is a good practice to optimize performance),
									// we would need to adjust this logic.
									editorViewContainerRect: getState().editorViewContainer?.getBoundingClientRect(),
								});
							})
						: undefined,
				onDebugUnsafeMessage,
				onSyntaxHelp,
				customComponents,
			});

			dispatch(actions.initialiseEditorState());
		},

	onUpdate:
		() =>
		(
			{ getState, setState, dispatch },
			{
				query: controlledQueryProp,
				isSearching,
				autocompleteProvider,
				externalMessages,
				enableRichInlineNodes,
				onDebugUnsafeMessage,
				onSyntaxHelp,
				customComponents,
			},
		) => {
			const { controlledQuery, query } = getState();

			// Track changes to our controlledQuery state
			if (controlledQuery !== controlledQueryProp) {
				setState({
					controlledQuery: controlledQueryProp,
				});

				// If the controlled query prop has changed and it doesn't match the query in our editor then we need to reset
				// the editor state.
				if (controlledQueryProp !== query) {
					dispatch(actions.resetEditorState(controlledQueryProp));
				}
			}

			setState({
				externalMessages,
				isSearching,
				autocompleteProvider,
				enableRichInlineNodes,
				onDebugUnsafeMessage,
				onSyntaxHelp,
				customComponents,
			});
		},
});
