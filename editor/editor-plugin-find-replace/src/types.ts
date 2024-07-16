import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type {
	ExtractInjectionAPI,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { DecorationSet, EditorView } from '@atlaskit/editor-prosemirror/view';

export interface FindReplacePluginState {
	/** Whether find/replace is active, i.e. displayed */
	isActive: boolean;
	/**
	 * Whether we should set focus into and select all text of find textfield
	 * This will be true if user highlights a word and hits cmd+f
	 */
	shouldFocus: boolean;
	/** Search keyword */
	findText: string;
	/** Text to replace with */
	replaceText: string;
	/** Index of selected word in array of matches, this gets updated as user finds next/prev */
	index: number;
	/** Positions of find results */
	matches: Match[];
	/** Decorations for the search results */
	decorationSet: DecorationSet;
	/** Whether find/replace should match case when searching for results */
	shouldMatchCase: boolean;
}

export type FindReplaceToolbarButtonWithStateProps = {
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	isToolbarReducedSpacing?: boolean;
	editorView: EditorView;
	containerElement: HTMLElement | null;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	takeFullWidth?: boolean;
	api: ExtractInjectionAPI<FindReplacePlugin> | undefined;
};

export type FindReplaceToolbarButtonActionProps = Omit<
	FindReplaceToolbarButtonWithStateProps,
	'api'
>;

type Config = {
	takeFullWidth: boolean;
	twoLineEditorToolbar: boolean;
};

export type FindReplacePlugin = NextEditorPlugin<
	'findReplace',
	{
		pluginConfiguration: Config;
		sharedState: FindReplacePluginState | undefined;
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<PrimaryToolbarPlugin>];
		actions: {
			getToolbarButton: (params: FindReplaceToolbarButtonActionProps) => React.ReactNode;
		};
	}
>;

export type Match = {
	/** Start position */
	start: number;
	/** End position */
	end: number;
};

export type TextGrouping = {
	/** The concatenated text across nodes */
	text: string;
	/** Start position */
	pos: number;
} | null;

export type FindReplaceOptions = {
	allowMatchCase?: boolean;
};

export type MatchCaseProps = {
	allowMatchCase?: boolean;
	shouldMatchCase?: boolean;
	onToggleMatchCase?: () => void;
};
