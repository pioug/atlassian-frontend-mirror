import React from 'react';

import type { InlineNodeViewComponentProps } from '@atlaskit/editor-common/react-node-view';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { isBlockSupportedAtPosition, isEmbedSupportedAtPosition } from '../utils';

import type { SmartCardProps } from './genericCard';
import { Card } from './genericCard';
import { InlineCardWithAwareness } from './inlineCardWithAwareness';

const WrappedInlineCardWithAwareness = Card(InlineCardWithAwareness, UnsupportedInline);

export type InlineCardNodeViewProps = Pick<
	SmartCardProps,
	| 'useAlternativePreloader'
	| 'actionOptions'
	| 'showServerActions'
	| 'allowEmbeds'
	| 'allowBlockCards'
	| 'enableInlineUpgradeFeatures'
	| 'pluginInjectionApi'
	| 'onClickCallback'
>;

type InlineCardWithAwarenessProps = {
	allowEmbeds?: boolean;
	allowBlockCards?: boolean;
	enableInlineUpgradeFeatures: boolean;
};

export function InlineCardNodeView(
	props: InlineNodeViewComponentProps & InlineCardNodeViewProps & InlineCardWithAwarenessProps,
) {
	const {
		useAlternativePreloader,
		node,
		view,
		getPos,
		actionOptions,
		showServerActions,
		allowEmbeds,
		allowBlockCards,
		enableInlineUpgradeFeatures,
		pluginInjectionApi,
		onClickCallback,
	} = props;

	return (
		<WrappedInlineCardWithAwareness
			node={node}
			view={view}
			getPos={getPos}
			actionOptions={actionOptions}
			showServerActions={showServerActions}
			useAlternativePreloader={useAlternativePreloader}
			pluginInjectionApi={pluginInjectionApi}
			onClickCallback={onClickCallback}
			{...(enableInlineUpgradeFeatures &&
				getAwarenessProps(view.state, getPos, allowEmbeds, allowBlockCards))}
		/>
	);
}

const getAwarenessProps = (
	editorState: EditorState,
	getPos: () => number | undefined,
	allowEmbeds?: boolean,
	allowBlockCards?: boolean,
) => {
	const linkPosition = getPos && typeof getPos() === 'number' ? getPos() : undefined;

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
		editorState.selection?.from === getPos();

	return {
		isPulseEnabled: canBeUpgradedToEmbed,
		isOverlayEnabled: canBeUpgradedToEmbed || canBeUpgradedToBlock,
		isSelected,
	};
};
