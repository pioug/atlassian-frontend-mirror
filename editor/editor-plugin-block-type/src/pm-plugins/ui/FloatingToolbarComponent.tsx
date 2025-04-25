import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
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

export function FloatingToolbarComponent({ api }: FloatingToolbarComponentProps) {
	const { blockTypeState } = useSharedPluginState(api, ['blockType'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});

	// currentBlockType
	const currentBlockTypeSelector = useSharedPluginStateSelector(api, 'blockType.currentBlockType', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const currentBlockType = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? currentBlockTypeSelector
		: blockTypeState?.currentBlockType;

	// blockTypesDisabled
	const blockTypesDisabledSelector = useSharedPluginStateSelector(
		api,
		'blockType.blockTypesDisabled',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const blockTypesDisabled = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? blockTypesDisabledSelector
		: blockTypeState?.blockTypesDisabled;

	// availableBlockTypes
	const availableBlockTypesSelector = useSharedPluginStateSelector(
		api,
		'blockType.availableBlockTypes',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const availableBlockTypes = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? availableBlockTypesSelector
		: blockTypeState?.availableBlockTypes;

	// availableBlockTypesInDropdown
	const availableBlockTypesInDropdownSelector = useSharedPluginStateSelector(
		api,
		'blockType.availableBlockTypesInDropdown',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const availableBlockTypesInDropdown = editorExperiment(
		'platform_editor_usesharedpluginstateselector',
		true,
	)
		? availableBlockTypesInDropdownSelector
		: blockTypeState?.availableBlockTypesInDropdown;

	// formattingIsPresent
	const formattingIsPresentSelector = useSharedPluginStateSelector(
		api,
		'blockType.formattingIsPresent',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const formattingIsPresent = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? formattingIsPresentSelector
		: blockTypeState?.formattingIsPresent;

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
