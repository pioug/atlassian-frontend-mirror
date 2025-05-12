import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
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

const useFloatingToolbarComponentPluginState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<BlockTypePlugin> | undefined) => {
		const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
		const blockTypesDisabled = useSharedPluginStateSelector(api, 'blockType.blockTypesDisabled');
		const availableBlockTypes = useSharedPluginStateSelector(api, 'blockType.availableBlockTypes');
		const availableBlockTypesInDropdown = useSharedPluginStateSelector(
			api,
			'blockType.availableBlockTypesInDropdown',
		);
		const formattingIsPresent = useSharedPluginStateSelector(api, 'blockType.formattingIsPresent');
		return {
			currentBlockType,
			blockTypesDisabled,
			availableBlockTypes,
			availableBlockTypesInDropdown,
			formattingIsPresent,
		};
	},
	(api: ExtractInjectionAPI<BlockTypePlugin> | undefined) => {
		const { blockTypeState } = useSharedPluginState(api, ['blockType']);
		return {
			currentBlockType: blockTypeState?.currentBlockType,
			blockTypesDisabled: blockTypeState?.blockTypesDisabled,
			availableBlockTypes: blockTypeState?.availableBlockTypes,
			availableBlockTypesInDropdown: blockTypeState?.availableBlockTypesInDropdown,
			formattingIsPresent: blockTypeState?.formattingIsPresent,
		};
	},
);

export function FloatingToolbarComponent({ api }: FloatingToolbarComponentProps) {
	const {
		currentBlockType,
		blockTypesDisabled,
		availableBlockTypes,
		availableBlockTypesInDropdown,
		formattingIsPresent,
	} = useFloatingToolbarComponentPluginState(api);

	const boundSetBlockType = useCallback(
		(name: TextBlockTypes) =>
			api?.core?.actions.execute(
				api?.blockType?.commands?.setTextLevel(name, INPUT_METHOD.FLOATING_TB),
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
