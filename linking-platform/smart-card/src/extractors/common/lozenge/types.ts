import { type LozengeProps as AtlaskitLozengeProps } from '@atlaskit/lozenge';
import { type InvokeActions } from '../../../state/hooks/use-invoke/types';

export type LinkLozengeColor = 'default' | 'success' | 'removed' | 'inprogress' | 'new' | 'moved';

export type AccentShortName =
	| 'blue'
	| 'gray'
	| 'green'
	| 'lime'
	| 'magenta'
	| 'orange'
	| 'purple'
	| 'red'
	| 'teal'
	| 'yellow';

export type LinkLozengeInvokeActions = InvokeActions;

export interface LinkLozenge {
	action?: LinkLozengeInvokeActions;
	text: string;
	appearance?: LinkLozengeColor;
	style?: AtlaskitLozengeProps['style'];
}

export type LinkDocumentState = 'archived' | 'draft' | 'current';
export type LinkPullRequestState = 'open' | 'merged' | 'declined' | 'closed';

export type LinkState = LinkDocumentState & LinkPullRequestState;
