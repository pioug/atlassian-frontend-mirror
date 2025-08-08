import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { formatShortcut, toggleBlockQuote } from '@atlaskit/editor-common/keymaps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import type { BlockTypeWithRank } from '../../types';

type QuoteButtonProps = {
	blockType: BlockTypeWithRank;
	api?: ExtractInjectionAPI<BlockTypePlugin>;
};

export const QuoteButton = ({ blockType, api }: QuoteButtonProps) => {
	const { formatMessage } = useIntl();
	const availableBlockTypesInDropdown = useSharedPluginStateSelector(
		api,
		'blockType.availableBlockTypesInDropdown',
	);
	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');

	if (
		!availableBlockTypesInDropdown?.some(
			(availableBlockType) => availableBlockType.name === blockType.name,
		)
	) {
		return null;
	}

	const onClick = () => {
		api?.core?.actions.execute(api?.blockType?.commands?.insertBlockQuote(INPUT_METHOD.TOOLBAR));
	};

	const shortcut = formatShortcut(toggleBlockQuote);

	return (
		<ToolbarDropdownItem
			elemBefore={blockType.icon}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			onClick={onClick}
			isSelected={currentBlockType === blockType}
			ariaKeyshortcuts={shortcut}
		>
			{formatMessage(blockType.title)}
		</ToolbarDropdownItem>
	);
};
