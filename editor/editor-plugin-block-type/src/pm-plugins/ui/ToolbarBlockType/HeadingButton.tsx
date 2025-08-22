import React from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	formatShortcut,
	type Keymap,
	setNormalText,
	toggleHeading1,
	toggleHeading2,
	toggleHeading3,
	toggleHeading4,
	toggleHeading5,
	toggleHeading6,
} from '@atlaskit/editor-common/keymaps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import type { TextBlockTypes } from '../../block-types';
import type { BlockTypeWithRank } from '../../types';

type HeadingButtonProps = {
	api?: ExtractInjectionAPI<BlockTypePlugin>;
	blockType: BlockTypeWithRank;
};

type HeadingName =
	| 'normal'
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6';

const headingSizeStylesMap = cssMap({
	normal: {
		font: token('font.body'),
	},
	heading1: {
		font: token('font.heading.xlarge'),
	},
	heading2: {
		font: token('font.heading.large'),
	},
	heading3: {
		font: token('font.heading.medium'),
	},
	heading4: {
		font: token('font.heading.small'),
	},
	heading5: {
		font: token('font.heading.xsmall'),
	},
	heading6: {
		font: token('font.heading.xxsmall'),
	},
});

const shortcuts: Record<HeadingName, Keymap> = {
	normal: setNormalText,
	heading1: toggleHeading1,
	heading2: toggleHeading2,
	heading3: toggleHeading3,
	heading4: toggleHeading4,
	heading5: toggleHeading5,
	heading6: toggleHeading6,
};

export const HeadingButton = ({ blockType, api }: HeadingButtonProps) => {
	const { formatMessage } = useIntl();
	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
	const availableBlockTypesInDropdown = useSharedPluginStateSelector(
		api,
		'blockType.availableBlockTypesInDropdown',
	);

	if (
		!availableBlockTypesInDropdown?.some(
			(availableBlockType) => availableBlockType.name === blockType.name,
		)
	) {
		return null;
	}

	const fromBlockQuote = currentBlockType?.name === 'blockquote';
	const onClick = () => {
		api?.core?.actions.execute(
			api?.blockType?.commands?.setTextLevel(
				blockType.name as TextBlockTypes,
				INPUT_METHOD.TOOLBAR,
				fromBlockQuote,
			),
		);
	};
	const shortcut = formatShortcut(shortcuts[blockType.name as HeadingName]);

	const isSelected = currentBlockType === blockType;

	return (
		<ToolbarDropdownItem
			elemBefore={blockType.icon}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			onClick={onClick}
			isSelected={isSelected}
			ariaKeyshortcuts={shortcut}
		>
			<Box xcss={headingSizeStylesMap[blockType.name as HeadingName]}>
				{formatMessage(blockType.title)}
			</Box>
		</ToolbarDropdownItem>
	);
};
