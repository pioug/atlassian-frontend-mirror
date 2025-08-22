import type { IntlShape } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { DecorationSet, EditorView } from '@atlaskit/editor-prosemirror/view';

import type { FindReplacePlugin } from '../findReplacePluginType';
export interface FindReplacePluginState {
	/** api */
	api?: ExtractInjectionAPI<FindReplacePlugin>;
	/** Decorations for the search results */
	decorationSet: DecorationSet;
	/** Search keyword */
	findText: string;
	/** Intl object */
	getIntl?: () => IntlShape;
	/** Index of selected word in array of matches, this gets updated as user finds next/prev */
	index: number;
	/** Whether find/replace is active, i.e. displayed */
	isActive: boolean;
	/** Positions of find results */
	matches: Match[];
	/** Text to replace with */
	replaceText: string;
	/**
	 * Whether we should set focus into and select all text of find textfield
	 * This will be true if user highlights a word and hits cmd+f
	 */
	shouldFocus: boolean;
	/** Whether find/replace should match case when searching for results */
	shouldMatchCase: boolean;
}

export type FindReplaceToolbarButtonWithStateProps = {
	api: ExtractInjectionAPI<FindReplacePlugin> | undefined;
	containerElement: HTMLElement | null;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	doesNotHaveButton?: boolean;
	editorView: EditorView;
	isButtonHidden?: boolean;
	isToolbarReducedSpacing?: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	takeFullWidth?: boolean;
};

export type FindReplaceToolbarButtonActionProps = Omit<
	FindReplaceToolbarButtonWithStateProps,
	'api'
>;

export type Match = {
	/** Boolean for whether the match can be replaced */
	canReplace?: boolean;
	/** End position */
	end: number;
	/** Type of the node of the match */
	nodeType?: string;
	/** Start position */
	start: number;
};

export type TextGrouping = {
	/** Start position */
	pos: number;
	/** The concatenated text across nodes */
	text: string;
} | null;

export type FindReplaceOptions = {
	allowMatchCase?: boolean;
};

export type MatchCaseProps = {
	allowMatchCase?: boolean;
	onToggleMatchCase?: () => void;
	shouldMatchCase?: boolean;
};
