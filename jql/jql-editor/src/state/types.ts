import { type FocusEvent, type MouseEvent, type MutableRefObject, type ReactNode } from 'react';

import { type IntlShape } from 'react-intl-next';
import { type Subscription } from 'rxjs/Subscription';

import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { type Jast, type JQLParseError } from '@atlaskit/jql-ast';
import {
	type JQLRuleContext,
	type JQLRuleSuggestions,
	type TokenSuggestions,
} from '@atlaskit/jql-autocomplete';

import { type JqlEditorAnalyticsEvent } from '../analytics';
import {
	type AutocompleteOptionGroup,
	type AutocompleteProvider,
} from '../plugins/autocomplete/types';
import { type HydratedValue, type HydratedValues } from '../ui/jql-editor/types';

export type ContextAwareTokenSuggestions = TokenSuggestions & {
	context?: JQLRuleContext;
};

export type ContextAwareJQLSuggestions = {
	tokens: ContextAwareTokenSuggestions;
	rules: JQLRuleSuggestions;
};

/**
 * Analytic attributes emitted whenever external JQL errors are viewed in the UI.
 */
export type ExternalErrorAttributes = {
	hasClientError: boolean;
	semanticErrorCount: number;
	syntaxErrorCount: number;
	syntaxErrorTypes: string[];
};

/**
 * Custom error messages to display for an invalid query. This should be sourced from the server when a query is
 * submitted to perform additional semantic validation that cannot be performed on the client, e.g. "The option
 * 'Chocolate' for field 'Ice cream' does not exist".
 */
export type ExternalError = {
	/**
	 * Type of the message.
	 */
	type: 'error';
	/**
	 * Message to display.
	 */
	message: ReactNode;
	/**
	 * Optional identifying error type when a syntax error has occurred. This should be one of the types defined in the
	 * `JqlSyntaxQueryErrorExtension` node of the Atlassian GraphQL schema.
	 */
	errorType?: string;
};

export type ExternalWarning = {
	/**
	 * Type of the message.
	 */
	type: 'warning';
	/**
	 * Message to display.
	 */
	message: ReactNode;
};

export type ExternalInfo = {
	/**
	 * Type of the message.
	 */
	type: 'info';
	/**
	 * Message to display.
	 */
	message: ReactNode;
};

export type ExternalMessage = ExternalError | ExternalWarning | ExternalInfo;

export type ExternalMessagesNormalized = {
	errors: ExternalError[];
	warnings: ExternalWarning[];
	infos: ExternalInfo[];
};

export type AutocompletePosition = {
	top: number;
	left: number;
};

export type OptionsKey = keyof Omit<AutocompleteOptionGroup, 'tokens'>;

export type AutocompleteState = {
	/**
	 * ID of the currently selected autocomplete option, or `undefined` if no option is selected.
	 */
	selectedOptionId: string | undefined;
	/**
	 * Forces autocomplete to stay closed on next update, which is the desired behavior when:
	 * - we select an autocomplete option
	 * - we navigate the query with arrow keys
	 */
	shouldStayClosedOnNextUpdate: boolean;
	/**
	 * Manages current autocomplete visibility state, derived from `shouldStayClosedOnNextUpdate`.
	 */
	shouldStayClosed: boolean;
	/**
	 * Determines if autocomplete options are currently being loaded.
	 */
	loading: boolean;
	/**
	 * Autocomplete options returned by autocomplete provider functions.
	 */
	options: AutocompleteOptionGroup;
	/**
	 * Autocomplete provider is an Observable based API. This references any in-flight subscription so we can cancel it
	 * upon a new request.
	 */
	subscription: Subscription | null;
	/**
	 * Subscription for a debounced autocomplete analytics event. This allows the event to be cancelled upon a new request.
	 */
	analyticsSubscription: Subscription | null;
	/**
	 * Reference to the autocomplete container DOM element.
	 */
	container: HTMLElement | null;
	/**
	 * Provides information about autocomplete offset parent's size and its position relative to the viewport.
	 * This is used to calculate autocomplete dropdown position.
	 */
	offsetParentRect: DOMRectReadOnly | undefined;
	/**
	 * Computed replace position start for the current set of autocomplete options.
	 * We use this position to derive autocomplete dropdown coordinates.
	 */
	replacePositionStart: number;
};

export type HydratedValuesMap = {
	[fieldName: string]: Map<string, HydratedValue>;
};

export type State = {
	/**
	 * The controlled query prop passed to the container.
	 */
	controlledQuery: string;
	/**
	 * The current query string in the JQL editor.
	 */
	query: string;
	/**
	 * Custom messages to display.
	 */
	externalMessages: ExternalMessage[];
	/**
	 * The current Prosemirror editor state.
	 */
	editorState: EditorState;
	/**
	 * The Prosemirror editor view mounted to the DOM, or `undefined` if the view has not been initialised.
	 */
	editorView: EditorView | undefined;
	/**
	 * Flag to enable the searching indicator when a JQL search is in progress.
	 */
	isSearching: boolean | undefined;
	/**
	 * Mutable reference to a react-intl object.
	 */
	intlRef: MutableRefObject<IntlShape>;
	/**
	 * Provider object to fetch autocomplete data.
	 */
	autocompleteProvider: AutocompleteProvider;
	/**
	 * Prefix to use when computing id's for DOM elements (to allow multiple editors rendered on the same page).
	 */
	idPrefix: string;
	/**
	 * ID of the timeout used before setting `editorViewHasFocus=false`. This gives an opportunity for the timeout to be
	 * cleared if another element within the context receives focus.
	 */
	editorViewBlurTimeout: number | null;
	/**
	 * Flag to determine whether the editor view (or autocomplete dropdown) currently has focus.
	 */
	editorViewHasFocus: boolean;
	/**
	 * Flag to determine whether line numbers should be shown in the editor.
	 */
	lineNumbersVisible: boolean;
	/**
	 * The first JQL parse error of the last submitted query, or {@code null} if there were no errors.
	 */
	jqlError: JQLParseError | null;
	/**
	 * State managed by the autocomplete plugin.
	 */
	autocomplete: AutocompleteState;
	/**
	 * Whether rich inline nodes feature should be enabled.
	 */
	enableRichInlineNodes: boolean;
	/**
	 * Map of hydrated values.
	 */
	hydratedValues: HydratedValuesMap;
	/**
	 * Reference to the ResizeObserver object used to process size changes within the editor.
	 */
	resizeObserver: ResizeObserver | undefined;
	/**
	 * Reference to the editor view container (scrollable element that contains line numbers and editor view).
	 */
	editorViewContainer: HTMLElement | undefined;
	/**
	 * Provides information about editor view container size and its position relative to the viewport.
	 * Can be used to position portals in relation to the editor, ensure they don't exceed its dimensions, etc.
	 */
	editorViewContainerRect: DOMRectReadOnly | undefined;
	/**
	 * Number of pixels that the editor view container is currently scrolled vertically (Y axis).
	 */
	editorViewContainerScroll: number;
	/**
	 * Called when we want to debug a particular error or action that has occurred within the editor. The message may
	 * contain PII, and as such consumers should treat as a privacy unsafe error.
	 */
	onDebugUnsafeMessage:
		| ((message: string, event: { [key: string]: DebugMessageEventAttribute }) => void)
		| undefined;
	/**
	 * Called when the syntax help button is clicked. Consumers can return `true` to signify that this event has been
	 * handled which will prevent default behaviour of the help button, i.e. `e.preventDefault()`.
	 */
	onSyntaxHelp?: (e: MouseEvent<HTMLElement>) => boolean;
};

export type DebugMessageEventAttribute = string | number | boolean | void | null;

export type Props = {
	query: string;
	externalMessages: ExternalMessage[];
	isSearching: boolean | undefined;
	intlRef: MutableRefObject<IntlShape>;
	createAndFireAnalyticsEvent: (payload: JqlEditorAnalyticsEvent) => void;
	onEditorMounted?: () => void;
	onDebugUnsafeMessage?: (
		message: string,
		event: { [key: string]: DebugMessageEventAttribute },
	) => void;
	onHydrate?: (query: string) => Promise<HydratedValues>;
	onUpdate?: (query: string, jast: Jast) => void;
	onSearch?: (query: string, jast: Jast) => void;
	autocompleteProvider: AutocompleteProvider;
	enableRichInlineNodes: boolean;
	onSyntaxHelp?: (e: MouseEvent<HTMLElement>) => boolean;
	onFocus?: (e: FocusEvent<HTMLElement>) => void;
};
