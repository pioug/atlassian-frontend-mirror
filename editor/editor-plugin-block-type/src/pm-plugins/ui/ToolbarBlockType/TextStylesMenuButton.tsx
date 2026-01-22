import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownMenu, ToolbarTooltip, TextIcon } from '@atlaskit/editor-toolbar';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import { toolbarBlockTypesWithRank } from '../../block-types';

type TextStylesMenuButtonProps = {
	api?: ExtractInjectionAPI<BlockTypePlugin>;
	children: React.ReactNode;
};

const usePluginState = (api?: ExtractInjectionAPI<BlockTypePlugin>) => {
	return useSharedPluginStateWithSelector(api, ['blockType'], (state) => ({
		blockTypesDisabled: state.blockTypeState?.blockTypesDisabled,
		currentBlockType: state.blockTypeState?.currentBlockType,
	}));
};

export const TextStylesMenuButton = ({ api, children }: TextStylesMenuButtonProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const { blockTypesDisabled, currentBlockType } = usePluginState(api);
	const blockTypes = toolbarBlockTypesWithRank();
	const { editorAppearance } = useEditorToolbar();

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
