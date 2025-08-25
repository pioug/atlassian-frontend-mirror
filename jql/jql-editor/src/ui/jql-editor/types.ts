import { type FocusEvent, type MouseEvent, type Ref } from 'react';

import { type Jast } from '@atlaskit/jql-ast';

import { type AutocompleteProvider } from '../../plugins/autocomplete/types';
import { type CustomComponents, type ExternalMessage } from '../../state/types';

export type HydratedUser = {
	avatarUrl: string;
	id: string;
	name: string;
	type: 'user';
};

export type HydratedDeprecatedField = {
	deprecatedSearcherKey: string;
	/**
	 * The jqlTerm of the field.
	 */
	id: string;
	type: 'deprecated-field';
};

export type HydratedValue = HydratedUser | HydratedDeprecatedField;

export type HydratedValues = {
	[fieldName: string]: HydratedValue[];
};

export type JQLEditorUIProps = {
	/**
	 * Page/experience where the component is being rendered. Used to correlate JQL analytics events to a given consumer.
	 */
	analyticsSource: string;
	/**
	 * Provider object to fetch autocomplete data.
	 */
	autocompleteProvider: AutocompleteProvider;
	/**
	 * Custom components to take over the rendering of certain parts of JQL editor
	 */
	customComponents?: CustomComponents;
	/**
	 * Enables rich inline nodes feature, which will replace user identifiers with a lozenge containing name and avatar.
	 * Note that you must specify an `onHydrate` prop which will return user data for a given query in order to see the
	 * following behaviour:
	 *  - Loading of user avatars
	 *  - Rendering of user lozenges on component initialisation
	 *  - Rendering of user lozenges on paste
	 */
	enableRichInlineNodes?: boolean;
	/**
	 * Ref callback to force the focus event
	 */
	inputRef?: Ref<{ focus: () => void }>;
	/**
	 * `false` matches the Atlaskit default field styling
	 * `true` matches the Atlaskit compact field styling, generally used for search purposes.
	 */
	isCompact?: boolean;
	/**
	 * Flag to enable the searching indicator when a JQL search is in progress.
	 */
	isSearching?: boolean;
	/**
	 * Custom messages to display.
	 */
	messages?: ExternalMessage[];
	/**
	 * Called when we want to debug a particular error or action that has occurred within the editor. The message may
	 * contain PII, and as such consumers should treat as a privacy unsafe error.
	 */
	onDebugUnsafeMessage?: (
		message: string,
		event: { [key: string]: string | number | boolean | void | null },
	) => void;
	/**
	 * Called when the JQL editor has been initialised.
	 */
	onEditorMounted?: () => void;
	/**
	 * Called when the editor input is focused.
	 */
	onFocus?: (e: FocusEvent<HTMLElement>) => void;
	/**
	 * Called every time the editor needs to hydrate values for the current query.
	 */
	onHydrate?: (query: string) => Promise<HydratedValues>;
	/**
	 * Called if an unexpected error is thrown while rendering the editor.
	 */
	onRenderError?: (error: Error) => void;
	/**
	 * Called every time the search command is given in the editor with the current query value and respective Jast object.
	 * If not passed, hides the search button/other search related functionality, allowing this to be usable as a form field.
	 */
	onSearch?: (query: string, jast: Jast) => void;
	/**
	 * Called when the syntax help button is clicked. Consumers can return `true` to signify that this event has been
	 * handled which will prevent default behaviour of the help button, i.e. `e.preventDefault()`.
	 */
	onSyntaxHelp?: (e: MouseEvent<HTMLElement>) => boolean;
	/**
	 * Called every time the editor is updated with the current query value and respective Jast object.
	 */
	onUpdate?: (query: string, jast: Jast) => void;

	/**
	 * The query to render in the editor.
	 */
	query: string;
};
