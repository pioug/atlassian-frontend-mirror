import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
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
	const blockTypes = toolbarBlockTypesWithRank();
	const { editorAppearance } = useEditorToolbar();

	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
	const CurrentIcon = Object.values(blockTypes).find(
		(blockType) => blockType.name === currentBlockType?.name,
	)?.icon?.type;

	const normalText = blockTypes.normal;

	const TriggerIcon = useMemo(() => {
		if (editorAppearance === 'full-page') {
			const hasCurrentBlockType = currentBlockType && CurrentIcon;
			const Icon = hasCurrentBlockType ? CurrentIcon : TextIcon;
			return (
				<>
					<Icon label="" size="small" />
					{hasCurrentBlockType
						? formatMessage(currentBlockType.title)
						: formatMessage(normalText.title)}
				</>
			);
		}

		return CurrentIcon ? (
			<CurrentIcon
				label={`${currentBlockType?.name} ${formatMessage(toolbarMessages.textStylesTooltip)}`}
				size="small"
			/>
		) : (
			<TextIcon label={formatMessage(toolbarMessages.textStylesTooltip)} size="small" />
		);
	}, [editorAppearance, currentBlockType, CurrentIcon, normalText, formatMessage]);

	return (
		<ToolbarTooltip content={formatMessage(toolbarMessages.textStylesTooltip)}>
			<ToolbarDropdownMenu isDisabled={blockTypesDisabled} iconBefore={TriggerIcon}>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	);
};
