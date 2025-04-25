import React from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockTypePlugin } from '../../blockTypePluginType';
import type { TextBlockTypes } from '../block-types';

import ToolbarBlockType from './ToolbarBlockType';

interface PrimaryToolbarComponentProps {
	isSmall: boolean;
	isToolbarReducedSpacing: boolean;
	disabled: boolean;
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	shouldUseDefaultRole: boolean;
}

export function PrimaryToolbarComponent({
	api,
	isSmall,
	disabled,
	isToolbarReducedSpacing,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	shouldUseDefaultRole,
}: PrimaryToolbarComponentProps) {
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

	const boundSetBlockType = (name: TextBlockTypes, fromBlockQuote?: boolean) =>
		api?.core?.actions.execute(
			api?.blockType?.commands?.setTextLevel(name, INPUT_METHOD.TOOLBAR, fromBlockQuote),
		);
	const wrapBlockQuote = () =>
		api?.core?.actions.execute(api?.blockType?.commands?.insertBlockQuote(INPUT_METHOD.TOOLBAR));
	const clearFormatting = () =>
		api?.core?.actions.execute(api?.blockType?.commands?.clearFormatting(INPUT_METHOD.TOOLBAR));
	return (
		<ToolbarBlockType
			isSmall={isSmall}
			isDisabled={disabled}
			isReducedSpacing={isToolbarReducedSpacing}
			setTextLevel={boundSetBlockType}
			wrapBlockQuote={wrapBlockQuote}
			clearFormatting={clearFormatting}
			currentBlockType={currentBlockType}
			blockTypesDisabled={blockTypesDisabled}
			availableBlockTypes={availableBlockTypes}
			availableBlockTypesInDropdown={availableBlockTypesInDropdown}
			formattingIsPresent={formattingIsPresent}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
			shouldUseDefaultRole={shouldUseDefaultRole}
			api={api}
		/>
	);
}
