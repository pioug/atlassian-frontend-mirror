import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';

import type { BlockTypePlugin } from '../../blockTypePluginType';
import type { TextBlockTypes } from '../block-types';
import ToolbarBlockType from './ToolbarBlockType';

interface FloatingToolbarComponentProps {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
}

const FloatingToolbarSettings = {
	isSmall: true,
	disabled: false,
	shouldUseDefaultRole: false,
};

export function FloatingToolbarComponent({
	api,
}: FloatingToolbarComponentProps): React.JSX.Element {
	const {
		currentBlockType,
		blockTypesDisabled,
		availableBlockTypes,
		availableBlockTypesInDropdown,
	} = useSharedPluginStateWithSelector(api, ['blockType'], (states) => ({
		currentBlockType: states.blockTypeState?.currentBlockType,
		blockTypesDisabled: states.blockTypeState?.blockTypesDisabled,
		availableBlockTypes: states.blockTypeState?.availableBlockTypes,
		availableBlockTypesInDropdown: states.blockTypeState?.availableBlockTypesInDropdown,
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
			isReducedSpacing={false}
			setTextLevel={boundSetBlockType}
			currentBlockType={currentBlockType}
			blockTypesDisabled={blockTypesDisabled}
			availableBlockTypes={availableBlockTypes}
			availableBlockTypesInDropdown={availableBlockTypesInDropdown}
			wrapBlockQuote={wrapBlockQuote}
			clearFormatting={clearFormatting}
			shouldUseDefaultRole={FloatingToolbarSettings.shouldUseDefaultRole}
			api={api}
		/>
	);
}
