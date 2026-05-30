/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css } from '@compiled/react';
import { useIntl } from 'react-intl';

import { jsx } from '@atlaskit/css';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
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
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import type { TextBlockTypes } from '../../block-types';
import type { BlockType, BlockTypeWithRank } from '../../types';
import { isSelectionInsideListNode } from '../../utils';

type HeadingButtonProps = {
	api?: ExtractInjectionAPI<BlockTypePlugin>;
	blockType: BlockTypeWithRank;
};

const smallTextStyle = css({
	font: editorUGCToken('editor.font.body.small'),
});

const normalStyle = css({
	font: editorUGCToken('editor.font.body'),
});

const heading1Style = css({
	font: editorUGCToken('editor.font.heading.h1'),
});

const heading2Style = css({
	font: editorUGCToken('editor.font.heading.h2'),
});

const heading3Style = css({
	font: editorUGCToken('editor.font.heading.h3'),
});

const heading4Style = css({
	font: editorUGCToken('editor.font.heading.h4'),
});

const heading5Style = css({
	font: editorUGCToken('editor.font.heading.h5'),
});

const heading6Style = css({
	font: editorUGCToken('editor.font.heading.h6'),
});

type HeadingTextProps = {
	children: React.ReactNode;
	headingType: TextBlockTypes;
};

const HeadingText = ({ children, headingType }: HeadingTextProps): React.JSX.Element => {
	switch (headingType) {
		case 'heading1':
			return <div css={heading1Style}>{children}</div>;
		case 'heading2':
			return <div css={heading2Style}>{children}</div>;
		case 'heading3':
			return <div css={heading3Style}>{children}</div>;
		case 'heading4':
			return <div css={heading4Style}>{children}</div>;
		case 'heading5':
			return <div css={heading5Style}>{children}</div>;
		case 'heading6':
			return <div css={heading6Style}>{children}</div>;
		case 'smallText':
			return <div css={smallTextStyle}>{children}</div>;
		case 'normal':
		default:
			return <div css={normalStyle}>{children}</div>;
	}
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
	const isMarkdownBridgeEnabled =
		expValEqualsNoExposure('cc-markdown-mode', 'isEnabled', true) &&
		fg('platform_editor_markdown_compatible_toolbar');
	const { markdownView, sourceFormatState } = useSharedPluginStateWithSelector(
		api,
		['markdownMode'],
		(states) => ({
			markdownView: isMarkdownBridgeEnabled ? states.markdownModeState?.view : undefined,
			sourceFormatState: isMarkdownBridgeEnabled
				? states.markdownModeState?.sourceBlockFormatState
				: null,
		}),
	);
	const { editorView } = useEditorToolbar();

	if (
		!availableBlockTypesInDropdown?.some(
			(availableBlockType) => availableBlockType.name === blockType.name,
		)
	) {
		return null;
	}

	// When in source view and the bridge is enabled, read heading level from
	// the CM6 Lezer-tree-derived format state rather than the PM block type state.
	// markdownView is authoritative for "in source view" — it flips synchronously
	// on setView. sourceFormatState is null between the view switch and the
	// first CM6 update listener fire, so we can't rely on it as the sentinel.
	const isMarkdownBridgeActive = markdownView === 'syntax';

	// Extract the numeric level from the block type name (e.g. 'heading1' → 1).
	const headingLevel = blockType.name.startsWith('heading')
		? parseInt(blockType.name.replace('heading', ''), 10)
		: null;

	const isDisabled = isMarkdownBridgeActive
		? Boolean(sourceFormatState?.inCodeBlock)
		: expValEquals('platform_editor_small_font_size', 'isEnabled', true)
			? shouldDisableHeadingButton(editorView?.state, blockType)
			: false;

	const fromBlockQuote = currentBlockType?.name === 'blockquote';
	const onClick = () => {
		if (isDisabled) {
			return;
		}

		// Route to CM6 when in source view.
		//
		// - heading1..6: apply/replace via toggleSourceHeading(targetLevel).
		// - normal (paragraph): if the cursor is currently on a heading line,
		//   call toggleSourceHeading with the *current* level — toggleHeading
		//   removes the prefix when invoked with the matching level, so this
		//   downgrades the heading back to a plain paragraph. No-op when not
		//   on a heading (already normal) or when smallText is selected (no
		//   markdown equivalent).
		if (isMarkdownBridgeActive) {
			const targetLevel =
				blockType.name === 'normal' ? (sourceFormatState?.headingLevel ?? null) : headingLevel;
			if (targetLevel !== null && targetLevel >= 1 && targetLevel <= 6) {
				api?.markdownMode?.actions.toggleSourceHeading(targetLevel as 1 | 2 | 3 | 4 | 5 | 6);
			}
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

	// In source view, derive isSelected from the Lezer heading level.
	// In WYSIWYG, use the existing PM block type comparison.
	//
	// Branches in source view:
	// - heading1..6: select when the source heading level matches.
	// - normal (paragraph): select when the source has no heading and is not
	//   inside a blockquote — i.e. cursor is on a plain markdown paragraph.
	// - smallText: no markdown equivalent, so never selected in source view.
	//
	// Guard on `sourceFormatState != null` up-front so the body can read the
	// fields directly — clearer than nested optional chains and not fragile to
	// future reordering of the conditions.
	const isSelected = isMarkdownBridgeActive
		? sourceFormatState != null
			? headingLevel !== null
				? sourceFormatState.headingLevel === headingLevel
				: blockType.name === 'normal'
					? sourceFormatState.headingLevel === null && !sourceFormatState.inBlockquote
					: false
			: false
		: currentBlockType?.name === blockType.name;

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
