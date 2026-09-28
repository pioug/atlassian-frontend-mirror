/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { useIntl } from 'react-intl';

import { jsx } from '@atlaskit/css';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	formatShortcut,
	setNormalText,
	toggleHeading1,
	toggleHeading2,
	toggleHeading3,
	toggleHeading4,
	toggleHeading5,
	toggleHeading6,
	toggleSmallText,
} from '@atlaskit/editor-common/keymaps';
import type { Keymap } from '@atlaskit/editor-common/keymaps';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { editorUGCToken } from '@atlaskit/editor-common/ugc-tokens';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import type { TextBlockTypes } from '../../block-types';
import type { BlockType, BlockTypeWithRank } from '../../types';
import { isSelectionInsideListNode } from '../../utils';

type HeadingButtonProps = {
	api?: ExtractInjectionAPI<BlockTypePlugin>;
	blockType: BlockTypeWithRank;
};

type HeadingTextProps = {
	children: React.ReactNode;
	headingType: TextBlockTypes;
};

const headingTextProps: Record<TextBlockTypes, { style: React.CSSProperties }> = {
	normal: { style: { font: editorUGCToken('editor.font.body') } },
	smallText: {
		style: { font: editorUGCToken('editor.font.body.small') ?? editorUGCToken('editor.font.body') },
	},
	heading1: { style: { font: editorUGCToken('editor.font.heading.h1') } },
	heading2: { style: { font: editorUGCToken('editor.font.heading.h2') } },
	heading3: { style: { font: editorUGCToken('editor.font.heading.h3') } },
	heading4: { style: { font: editorUGCToken('editor.font.heading.h4') } },
	heading5: { style: { font: editorUGCToken('editor.font.heading.h5') } },
	heading6: { style: { font: editorUGCToken('editor.font.heading.h6') } },
};

const HeadingText = ({ children, headingType }: HeadingTextProps): React.JSX.Element => {
	return React.createElement('div', headingTextProps[headingType], children);
};

const shortcuts: Record<TextBlockTypes, Keymap> = {
	normal: setNormalText,
	smallText: toggleSmallText,
	heading1: toggleHeading1,
	heading2: toggleHeading2,
	heading3: toggleHeading3,
	heading4: toggleHeading4,
	heading5: toggleHeading5,
	heading6: toggleHeading6,
};

const shouldDisableHeadingButton = (state: EditorState | undefined, blockType: BlockType) => {
	if (!state) {
		return false;
	}

	return (
		isSelectionInsideListNode(state) &&
		blockType.name !== 'normal' &&
		blockType.name !== 'smallText'
	);
};

export const HeadingButton = ({ blockType, api }: HeadingButtonProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
	const availableBlockTypesInDropdown = useSharedPluginStateSelector(
		api,
		'blockType.availableBlockTypesInDropdown',
	);
	const { editorView } = useEditorToolbar();

	if (
		!availableBlockTypesInDropdown?.some(
			(availableBlockType) => availableBlockType.name === blockType.name,
		)
	) {
		return null;
	}

	const isDisabled = shouldDisableHeadingButton(editorView?.state, blockType);

	const fromBlockQuote = currentBlockType?.name === 'blockquote';
	const onClick = () => {
		if (isDisabled) {
			return;
		}

		api?.core?.actions.execute(
			api?.blockType?.commands?.setTextLevel(
				blockType.name as TextBlockTypes,
				INPUT_METHOD.TOOLBAR,
				fromBlockQuote,
			),
		);
	};
	const shortcut = formatShortcut(shortcuts[blockType.name as TextBlockTypes]);

	const isSelected = currentBlockType?.name === blockType.name;

	return (
		<ToolbarDropdownItem
			elemBefore={blockType.icon}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			onClick={onClick}
			isSelected={isSelected}
			isDisabled={isDisabled}
			ariaKeyshortcuts={shortcut}
		>
			<HeadingText headingType={blockType.name as TextBlockTypes}>
				{formatMessage(blockType.title)}
			</HeadingText>
		</ToolbarDropdownItem>
	);
};
