import React from 'react';

import { useIntl } from 'react-intl';

import IconButton from '@atlaskit/button/icon/button';
import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import { BLOCK_CONTROLS_LEFT_GROUP } from '@atlaskit/editor-common/block-controls/surface-keys';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { blockControlsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterButton } from '@atlaskit/editor-ui-control-model/types';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import type { BlockCollapsePlugin } from '../blockCollapsePluginType';

const ChevronDownSmallIcon = () => <ChevronDownIcon label="" size="small" />;
const ChevronRightSmallIcon = () => <ChevronRightIcon label="" size="small" />;

const BlockCollapseButton = ({
	api,
	headingPos,
}: {
	api: ExtractInjectionAPI<BlockCollapsePlugin> | undefined;
	headingPos: number;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isCollapsed = useSharedPluginStateWithSelector(api, ['blockCollapse'], (states) =>
		Boolean(states.blockCollapseState?.collapsedHeadingPositions.has(headingPos)),
	);
	const handleClick = React.useCallback(() => {
		api?.core.actions.execute(api.blockCollapse?.commands.toggleHeading(headingPos));
	}, [api, headingPos]);
	const label = formatMessage(
		isCollapsed ? blockControlsMessages.expandSection : blockControlsMessages.collapseSection,
	);

	return (
		<Tooltip content={label} position="top">
			<IconButton
				appearance="subtle"
				aria-expanded={!isCollapsed}
				icon={isCollapsed ? ChevronRightSmallIcon : ChevronDownSmallIcon}
				label={label}
				onClick={handleClick}
				spacing="compact"
				testId="editor-collapse-heading-button"
			/>
		</Tooltip>
	);
};

export const getBlockCollapseButtonComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<BlockCollapsePlugin> | undefined;
}): RegisterButton[] => [
	{
		key: 'block-controls-collapse-heading',
		type: 'button',
		parents: [{ ...BLOCK_CONTROLS_LEFT_GROUP, rank: 300 }],
		isHidden: ({ surfaceContext } = {}) => {
			const context = surfaceContext?.get(BLOCK_CONTROL_UI_CONTEXT);
			// Case 1: Hide the control unless it targets a top-level heading.
			if (context?.targetNode.type.name !== 'heading' || context.targetNode.parentType !== 'doc') {
				return true;
			}
			// Case 2: Keep the control visible while its heading is active.
			if (context.targetNode.pos === context.activeNode?.pos) {
				return false;
			}
			// Case 3: Keep the control visible for an inactive heading only while it is collapsed.
			return !api?.blockCollapse?.sharedState
				.currentState()
				?.collapsedHeadingPositions.has(context.targetNode.pos);
		},
		component: ({ surfaceContext }) => {
			const context = surfaceContext?.get(BLOCK_CONTROL_UI_CONTEXT);
			return context ? <BlockCollapseButton api={api} headingPos={context.targetNode.pos} /> : null;
		},
	},
];
