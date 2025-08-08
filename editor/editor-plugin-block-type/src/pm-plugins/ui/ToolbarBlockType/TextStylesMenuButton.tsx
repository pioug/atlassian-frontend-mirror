import React from 'react';

import { useIntl } from 'react-intl-next';

import { toolbarMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownMenu, ToolbarTooltip, TextIcon } from '@atlaskit/editor-toolbar';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import { toolbarBlockTypesWithRank } from '../../block-types';

type TextStylesMenuButtonProps = {
	api?: ExtractInjectionAPI<BlockTypePlugin>;
	children: React.ReactNode;
};

export const TextStylesMenuButton = ({ api, children }: TextStylesMenuButtonProps) => {
	const { formatMessage } = useIntl();

	const blockTypesDisabled = useSharedPluginStateSelector(api, 'blockType.blockTypesDisabled');

	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
	const CurrentIcon = Object.values(toolbarBlockTypesWithRank()).find(
		(blockType) => blockType.name === currentBlockType?.name,
	)?.icon?.type;

	return (
		<ToolbarTooltip content={formatMessage(toolbarMessages.textStylesTooltip)}>
			<ToolbarDropdownMenu
				isDisabled={blockTypesDisabled}
				iconBefore={
					CurrentIcon ? (
						<CurrentIcon
							label={`${currentBlockType?.name} ${formatMessage(toolbarMessages.textStylesTooltip)}`}
						/>
					) : (
						<TextIcon label={formatMessage(toolbarMessages.textStylesTooltip)} />
					)
				}
			>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	);
};
