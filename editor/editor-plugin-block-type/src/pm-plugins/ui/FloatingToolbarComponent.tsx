import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockTypePlugin } from '../../blockTypePluginType';
import type { TextBlockTypes } from '../block-types';

import ToolbarBlockType from './ToolbarBlockType';

interface FloatingToolbarComponentProps {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
}

const FloatingToolbarSettings = {
	isSmall: true,
	disabled: false,
	isToolbarReducedSpacing: true,
	shouldUseDefaultRole: false,
};

export function FloatingToolbarComponent({ api }: FloatingToolbarComponentProps) {
	const {
		currentBlockType,
		blockTypesDisabled,
		availableBlockTypes,
		availableBlockTypesInDropdown,
		formattingIsPresent,
	} = useSharedPluginStateWithSelector(api, ['blockType'], (states) => ({
		currentBlockType: states.blockTypeState?.currentBlockType,
		blockTypesDisabled: states.blockTypeState?.blockTypesDisabled,
		availableBlockTypes: states.blockTypeState?.availableBlockTypes,
		availableBlockTypesInDropdown: states.blockTypeState?.availableBlockTypesInDropdown,
		formattingIsPresent: states.blockTypeState?.formattingIsPresent,
	}));

	const boundSetBlockType = useCallback(
		(name: TextBlockTypes, fromBlockQuote?: boolean) =>
			api?.core?.actions.execute(
				api?.blockType?.commands?.setTextLevel(name, INPUT_METHOD.FLOATING_TB, fromBlockQuote),
			),
		[api],
	);

	const wrapBlockQuote = useCallback(
		() =>
			api?.core?.actions.execute(
				api?.blockType?.commands?.insertBlockQuote(INPUT_METHOD.FLOATING_TB),
			),
		[api],
	);

	const clearFormatting = useCallback(
		() =>
			api?.core?.actions.execute(
				api?.blockType?.commands?.clearFormatting(INPUT_METHOD.FLOATING_TB),
			),
		[api],
	);

	return (
		<ToolbarBlockType
			isSmall={FloatingToolbarSettings.isSmall}
			isDisabled={FloatingToolbarSettings.disabled}
			isReducedSpacing={
				editorExperiment('platform_editor_controls', 'variant1')
					? false
					: FloatingToolbarSettings.isToolbarReducedSpacing
			}
			setTextLevel={boundSetBlockType}
			currentBlockType={currentBlockType}
			blockTypesDisabled={blockTypesDisabled}
			availableBlockTypes={availableBlockTypes}
			availableBlockTypesInDropdown={availableBlockTypesInDropdown}
			formattingIsPresent={formattingIsPresent}
			wrapBlockQuote={wrapBlockQuote}
			clearFormatting={clearFormatting}
			shouldUseDefaultRole={FloatingToolbarSettings.shouldUseDefaultRole}
			api={api}
		/>
	);
}
