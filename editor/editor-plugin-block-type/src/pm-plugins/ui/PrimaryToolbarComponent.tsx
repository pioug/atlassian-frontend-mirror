import React from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockTypePlugin } from '../../blockTypePluginType';
import type { TextBlockTypes } from '../block-types';

import ToolbarBlockType from './ToolbarBlockType';

interface PrimaryToolbarComponentProps {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
	disabled: boolean;
	isSmall: boolean;
	isToolbarReducedSpacing: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
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
}: PrimaryToolbarComponentProps): React.JSX.Element {
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
