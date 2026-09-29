import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownMenu, ToolbarTooltip, TextIcon } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import { toolbarBlockTypesWithRank } from '../../block-types';

type TextStylesMenuButtonProps = {
	allowFontSize?: boolean;
	api?: ExtractInjectionAPI<BlockTypePlugin>;
	children: React.ReactNode;
};

type SharedStateValue<Plugin> = Plugin extends {
	sharedState: { currentState: () => infer State };
}
	? State
	: never;

type BlockTypeSelectorState = {
	blockTypeState: SharedStateValue<NonNullable<ExtractInjectionAPI<BlockTypePlugin>['blockType']>>;
};

const selectPluginState = (state: BlockTypeSelectorState) => ({
	blockTypesDisabled: state.blockTypeState?.blockTypesDisabled,
	currentBlockType: state.blockTypeState?.currentBlockType,
});

const usePluginState = (api?: ExtractInjectionAPI<BlockTypePlugin>) =>
	useSharedPluginStateWithSelector(api, ['blockType'], selectPluginState);

export const TextStylesMenuButton = ({
	allowFontSize,
	api,
	children,
}: TextStylesMenuButtonProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const { blockTypesDisabled, currentBlockType } = usePluginState(api);
	const blockTypes = toolbarBlockTypesWithRank({ allowFontSize });
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
		<ToolbarDropdownMenu
			isDisabled={blockTypesDisabled}
			iconBefore={TriggerIcon}
			tooltipComponent={
				<ToolbarTooltip content={formatMessage(toolbarMessages.textStylesTooltip)} />
			}
			label={formatMessage(toolbarMessages.textStyles, {
				blockTypeName: currentBlockType?.name,
			})}
			shouldRenderToParent={fg('platform_editor_return_focus_after_text_styles_2')}
		>
			{children}
		</ToolbarDropdownMenu>
	);
};
