import type { CardAppearance } from '@atlaskit/editor-common/provider-factory';
import { type getPosHandler } from '@atlaskit/editor-common/react-node-view';
import type { Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { getResolvedAttributes } from '@atlaskit/link-analytics/resolved-attributes';
import {
	ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
	CONFLUENCE_SEARCH_DATASOURCE_ID,
	JIRA_LIST_OF_LINKS_DATASOURCE_ID,
} from '@atlaskit/link-datasource';
import type { CardContext } from '@atlaskit/link-provider';

import type { CardInfo, CardPluginState, DatasourceNode } from '../types';

import { pluginKey } from './plugin-key';

export const appearanceForNodeType = (spec: NodeType): CardAppearance | undefined => {
	if (spec.name === 'inlineCard') {
		return 'inline';
	} else if (spec.name === 'blockCard') {
		return 'block';
	} else if (spec.name === 'embedCard') {
		return 'embed';
	}
	return;
};

export const selectedCardAppearance = (state: EditorState) => {
	if (state.selection instanceof NodeSelection) {
		return appearanceForNodeType(state.selection.node.type);
	}
};

export type TitleUrlPair = { title?: string; url?: string };

export const titleUrlPairFromNode = (node: Node): TitleUrlPair => {
	const { attrs } = node;

	return {
		url: attrs.url || (attrs.data && attrs.data.url),
		title: attrs.data && attrs.data.title,
	};
};

/**
 * Merges the title and url from attributes and CardInfo from the resolved view, preferring the CardInfo.
 * @param titleUrlPair title and url information from the node attributes
 * @param info information stored in state from the resolved UI component view
 */
export const mergeCardInfo = (titleUrlPair: TitleUrlPair, info?: CardInfo): TitleUrlPair => {
	return {
		title: (info && info.title) || titleUrlPair.title,
		url: (info && info.url) || titleUrlPair.url,
	};
};

export const displayInfoForCard = (node: Node, info?: CardInfo) =>
	mergeCardInfo(titleUrlPairFromNode(node), info);

export const findCardInfo = (state: EditorState) => {
	const pluginState: CardPluginState | undefined = pluginKey.getState(state);
	if (!pluginState) {
		return undefined;
	}

	return pluginState.cards.find((cardInfo) => cardInfo.pos === state.selection.from);
};

const isAppearanceSupportedInParent = (
	currentNodePosition: number,
	editorState: EditorState,
	fragment: Fragment,
	currentAppearance?: CardAppearance,
): boolean => {
	const resolvedPosition = editorState.doc.resolve(currentNodePosition);
	const parent =
		currentAppearance === 'embed' || currentAppearance === 'block'
			? resolvedPosition.node()
			: resolvedPosition.node(-1);
	return parent && parent.type.validContent(fragment);
};

export const isEmbedSupportedAtPosition = (
	currentNodePosition: number,
	editorState: EditorState,
	currentAppearance?: CardAppearance,
): boolean =>
	isAppearanceSupportedInParent(
		currentNodePosition,
		editorState,
		Fragment.from(editorState.schema.nodes.embedCard.createChecked({})),
		currentAppearance,
	);

export const isBlockSupportedAtPosition = (
	currentNodePosition: number,
	editorState: EditorState,
	currentAppearance?: CardAppearance,
): boolean =>
	isAppearanceSupportedInParent(
		currentNodePosition,
		editorState,
		Fragment.from(editorState.schema.nodes.blockCard.createChecked({})),
		currentAppearance,
	);

export const getResolvedAttributesFromStore = (
	url: string,
	display: string | null,
	store?: CardContext['store'],
) => {
	if (!store) {
		return {};
	}
	const urlState = store?.getState()[url];
	const displayCategory = display === 'url' ? 'link' : undefined;
	return getResolvedAttributes({ url, displayCategory }, urlState?.details);
};

export const isDatasourceConfigEditable = (datasourceId: string) => {
	const datasourcesWithConfigModal = [
		JIRA_LIST_OF_LINKS_DATASOURCE_ID,
		ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
		CONFLUENCE_SEARCH_DATASOURCE_ID,
	];
	return datasourcesWithConfigModal.includes(datasourceId);
};

/**
 * Typeguard that checks node attributes are datasource node attributes
 * ** WARNING ** Typeguards are not a guarantee, if the asserted type changes
 * this function will not be updated automatically
 */
export const isDatasourceAdfAttributes = (
	attrs: Record<string, unknown> | undefined,
): attrs is DatasourceNode['attrs'] => {
	// Check is attributes object
	if (!(typeof attrs === 'object' && attrs !== null)) {
		return false;
	}

	// Check datasource attribute is an object
	if (!('datasource' in attrs)) {
		return false;
	}

	if (typeof attrs.datasource !== 'object' || attrs.datasource === null) {
		return false;
	}

	const hasId = 'id' in attrs.datasource && typeof attrs.datasource.id === 'string';

	const hasParameters =
		'parameters' in attrs.datasource &&
		typeof attrs.datasource.parameters === 'object' &&
		attrs.datasource.parameters !== null &&
		!Array.isArray(attrs.datasource.parameters);

	const hasViews = 'views' in attrs.datasource && Array.isArray(attrs.datasource.views);

	return hasId && hasParameters && hasViews;
};

/**
 * Typeguard that checks a node is a datasource node (blockCard and has datasource attributes)
 * ** WARNING ** Typeguards are not a guarantee, if the asserted type changes
 * this function will not be updated automatically
 */
export const isDatasourceNode = (node?: Node): node is DatasourceNode => {
	if (!node) {
		return false;
	}
	return node.type.name === 'blockCard' && isDatasourceAdfAttributes(node.attrs);
};

/**
 * Focuses the editorView if it's not already focused.
 * @param editorView The editor view to focus.
 */
export const focusEditorView = (editorView: EditorView) => {
	if (!editorView.hasFocus()) {
		editorView.focus();
	}
};

export const getAwarenessProps = (
	editorState: EditorState,
	getPos: getPosHandler,
	allowEmbeds?: boolean,
	allowBlockCards?: boolean,
	disableOverlay = false,
) => {
	const getPosFunction = typeof getPos !== 'boolean' ? getPos : undefined;
	const linkPosition = getPosFunction?.();

	const canBeUpgradedToEmbed =
		!!linkPosition && allowEmbeds
			? isEmbedSupportedAtPosition(linkPosition, editorState, 'inline')
			: false;

	const canBeUpgradedToBlock =
		!!linkPosition && allowBlockCards
			? isBlockSupportedAtPosition(linkPosition, editorState, 'inline')
			: false;

	const isSelected =
		editorState.selection instanceof NodeSelection &&
		editorState.selection?.node?.type === editorState.schema.nodes.inlineCard &&
		editorState.selection?.from === getPosFunction?.();

	return {
		isPulseEnabled: canBeUpgradedToEmbed,
		isOverlayEnabled: !disableOverlay && (canBeUpgradedToEmbed || canBeUpgradedToBlock),
		isSelected,
	};
};
