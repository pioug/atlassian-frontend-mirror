import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownMenu, ToolbarTooltip, TextIcon } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

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
	interactionState: SharedStateValue<
		NonNullable<ExtractInjectionAPI<BlockTypePlugin>['interaction']>
	>;
	markdownModeState: SharedStateValue<
		NonNullable<ExtractInjectionAPI<BlockTypePlugin>['markdownMode']>
	>;
};

const usePluginState = (api?: ExtractInjectionAPI<BlockTypePlugin>) => {
	// Memoized inside the hook (rather than at module scope) so the gate read
	// inside `toolbarBlockTypesWithRank` doesn't run at module import time —
	// that breaks downstream tests that import preset-default without
	// initializing the FeatureGates client.
	const sourceViewBlockTypeValues = useMemo(() => Object.values(toolbarBlockTypesWithRank({})), []);
	const selectPluginState = useCallback(
		(state: BlockTypeSelectorState) => {
			const pmCurrentBlockType =
				state.interactionState?.interactionState === 'hasNotHadInteraction' &&
				expValEquals('platform_editor_default_toolbar_state', 'isEnabled', true)
					? undefined
					: state.blockTypeState?.currentBlockType;

			// When the markdown bridge is active and the source view is mounted,
			// derive currentBlockType from the CM6 Lezer heading level rather than
			// PM block type state (which reflects the last WYSIWYG cursor position).
			const isMarkdownBridgeEnabled =
				expValEqualsNoExposure('cc-markdown-mode', 'isEnabled', true) &&
				fg('platform_editor_markdown_compatible_toolbar');
			const sourceFormatState = isMarkdownBridgeEnabled
				? state.markdownModeState?.sourceBlockFormatState
				: null;
			// markdownView is authoritative for "in source view" — it flips synchronously
			// on setView. sourceFormatState is null between the view switch and the first
			// CM6 update listener fire, so we can't rely on it as the sentinel.
			const isSourceViewActive =
				isMarkdownBridgeEnabled && state.markdownModeState?.view === 'syntax';

			// When in source view, derive currentBlockType from CM6 Lezer state
			// (heading level or blockquote) rather than PM block type state.
			// Guard on sourceFormatState being available — during the race window
			// after switching to source view but before CM6 fires its first update,
			// sourceFormatState is null even though isSourceViewActive is true.
			const currentBlockType =
				isSourceViewActive && sourceFormatState
					? sourceFormatState.headingLevel !== null
						? // In a heading, look up the full BlockType by name.
							(sourceViewBlockTypeValues.find(
								(bt) => bt.name === `heading${sourceFormatState.headingLevel}`,
							) ?? null)
						: sourceFormatState.inBlockquote
							? // In a blockquote, look up the blockquote BlockType.
								(sourceViewBlockTypeValues.find((bt) => bt.name === 'blockquote') ?? null)
							: // Plain paragraph — look up the 'normal' BlockType so the trigger
								// shows "Normal text" (matches WYSIWYG and HeadingButton's
								// Normal-in-source-view selection logic).
								(sourceViewBlockTypeValues.find((bt) => bt.name === 'normal') ?? null)
					: isSourceViewActive
						? null
						: pmCurrentBlockType;

			return {
				blockTypesDisabled:
					isSourceViewActive && sourceFormatState
						? Boolean(sourceFormatState.inCodeBlock)
						: isSourceViewActive
							? false
							: state.blockTypeState?.blockTypesDisabled,
				currentBlockType,
			};
		},
		[sourceViewBlockTypeValues],
	);

	return useSharedPluginStateWithSelector(
		api,
		['blockType', 'interaction', 'markdownMode'],
		selectPluginState,
	);
};

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
		>
			{children}
		</ToolbarDropdownMenu>
	);
};
