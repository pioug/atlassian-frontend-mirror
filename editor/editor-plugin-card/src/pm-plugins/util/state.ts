import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ACTION } from '@atlaskit/editor-common/analytics';
import type { CardReplacementInputMethod } from '@atlaskit/editor-common/card';
import type { CardAppearance, CardProvider } from '@atlaskit/editor-common/provider-factory';
import type { DatasourceModalType, EditorAppearance } from '@atlaskit/editor-common/types';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { DatasourceAdfView } from '@atlaskit/linking-common';
import type { SmartLinkEvents } from '@atlaskit/smart-card';

import type { CardPluginState, Request, ToolbarResolvedAttributes } from '../../types';
import type { DatasourceTableLayout } from '../../ui/LayoutButton/types';
import { pluginKey } from '../plugin-key';

// ============================================================================ //
// ============================== PLUGIN STATE ================================ //
// ============================================================================ //
// Used for interactions with the Card Plugin's state.
// ============================================================================ //
export const getPluginState = (editorState: EditorState) =>
	pluginKey.getState(editorState) as CardPluginState | undefined;

export const getPluginStateWithUpdatedPos = (
	pluginState: CardPluginState,
	tr: ReadonlyTransaction,
): {
	allowBlockCards?: boolean;
	allowEmbeds?: boolean;
	cards: {
		id?: string;
		pos: number;
		title?: string;
		url?: string;
	}[];
	datasourceModalType?: DatasourceModalType;
	datasourceStash: {
		[x: string]: {
			views: DatasourceAdfView[];
		};
	};
	datasourceTableRef?: HTMLElement;
	editorAppearance?: EditorAppearance;
	inlineCardAwarenessCandidatePosition?: number;
	layout?: DatasourceTableLayout;
	overlayCandidatePosition?: number;
	provider: CardProvider | null;
	removeOverlay?: () => void;
	requests: {
		analyticsAction?: ACTION;
		appearance: CardAppearance;
		compareLinkText: boolean;
		pos: number;
		previousAppearance?: CardAppearance | 'url';
		shouldReplaceLink?: boolean;
		source: CardReplacementInputMethod;
		sourceEvent?: UIAnalyticsEvent | null | undefined;
		url: string;
	}[];
	resolvedToolbarAttributesByUrl: Record<string, ToolbarResolvedAttributes>;
	selectedInlineLinkPosition?: number;
	showDatasourceModal: boolean;
	showLinkingToolbar: boolean;
	smartLinkEvents?: SmartLinkEvents;
} => ({
	...pluginState,
	requests: pluginState.requests.map((request) => ({
		...request,
		pos: tr.mapping.map(request.pos),
	})),
	cards: pluginState.cards.map((card) => ({
		...card,
		pos: tr.mapping.map(card.pos),
	})),
});

export const getNewRequests = (
	oldState: CardPluginState | undefined,
	currentState: CardPluginState,
): Request[] => {
	if (oldState) {
		return currentState.requests.filter(
			(req) => !oldState.requests.find((oldReq) => isSameRequest(oldReq, req)),
		);
	}
	return currentState.requests;
};

const isSameRequest = (requestA: Request, requestB: Request) =>
	requestA.url === requestB.url && requestA.pos === requestB.pos;
