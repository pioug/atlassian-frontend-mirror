/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';
import { FormattedMessage } from 'react-intl-next';

import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import {
	addInlineComment,
	addLink,
	alignCenter,
	alignLeft,
	alignRight,
	askAIQuickInsert,
	clearFormatting,
	decreaseMediaSize,
	focusTableResizer,
	focusToContextMenuTrigger,
	increaseMediaSize,
	insertRule,
	navToEditorToolbar,
	navToFloatingToolbar,
	pastePlainText,
	redo,
	redoAlt,
	setNormalText,
	toggleBlockQuote,
	toggleBold,
	toggleBulletList,
	toggleCode,
	toggleHeading1,
	toggleHeading2,
	toggleHeading3,
	toggleHeading4,
	toggleHeading5,
	toggleHeading6,
	toggleHighlightPalette,
	toggleItalic,
	toggleOrderedList,
	toggleStrikethrough,
	toggleSubscript,
	toggleSuperscript,
	toggleTaskItemCheckbox,
	toggleUnderline,
	undo,
} from '@atlaskit/editor-common/keymaps';
import {
	alignmentMessages,
	annotationMessages,
	blockTypeMessages,
	listMessages,
	helpDialogMessages as messages,
	toolbarInsertBlockMessages,
	toolbarMessages,
	undoRedoMessages,
} from '@atlaskit/editor-common/messages';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import type { Format } from './Format';
import { shortcutsArray } from './styles';

const codeSm = xcss({
	backgroundColor: 'color.background.neutral',
	borderRadius: 'radius.small',
	width: token('space.300'),
	display: 'inline-block',
	height: token('space.300'),
	lineHeight: token('space.300'),
	textAlign: 'center',
});

const codeMd = xcss({
	backgroundColor: 'color.background.neutral',
	borderRadius: 'radius.small',
	display: 'inline-block',
	height: token('space.300'),
	lineHeight: token('space.300'),
	width: '50px',
	textAlign: 'center',
});

const codeLg = xcss({
	borderRadius: 'radius.small',
	display: 'inline-block',
	height: token('space.300'),
	lineHeight: token('space.300'),
	textAlign: 'center',
	paddingInline: 'space.150',
	backgroundColor: 'color.background.neutral',
});

const navigationKeymaps: (intl: IntlShape) => Format[] = ({ formatMessage }) => [
	{
		name: formatMessage(toolbarMessages.navigateToEditorToolbar),
		type: 'navigation',
		keymap: () => navToEditorToolbar,
	},
	{
		name: formatMessage(toolbarMessages.navigateToFloatingToolbar),
		type: 'navigation',
		keymap: () => navToFloatingToolbar,
	},
];

export const formatting: (intl: IntlShape) => Format[] = ({ formatMessage }) => [
	{
		name: formatMessage(toolbarMessages.bold),
		type: 'strong',
		keymap: () => toggleBold,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					**
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...toolbarMessages.bold}
					/>
					**
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarMessages.italic),
		type: 'em',
		keymap: () => toggleItalic,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					*
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...toolbarMessages.italic}
					/>
					*
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarMessages.underline),
		type: 'underline',
		keymap: () => toggleUnderline,
	},
	{
		name: formatMessage(toolbarMessages.strike),
		type: 'strike',
		keymap: () => toggleStrikethrough,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					~~
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...toolbarMessages.strike}
					/>
					~~
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarMessages.subscript),
		type: 'subsup',
		keymap: () => toggleSubscript,
	},
	{
		name: formatMessage(toolbarMessages.superscript),
		type: 'subsup',
		keymap: () => toggleSuperscript,
	},
	{
		name: formatMessage(blockTypeMessages.heading1),
		type: 'heading',
		keymap: () => toggleHeading1,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeSm}>
					#
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading2),
		type: 'heading',
		keymap: () => toggleHeading2,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					##
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading3),
		type: 'heading',
		keymap: () => toggleHeading3,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					###
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading4),
		type: 'heading',
		keymap: () => toggleHeading4,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					####
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading5),
		type: 'heading',
		keymap: () => toggleHeading5,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					#####
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading6),
		type: 'heading',
		keymap: () => toggleHeading6,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					######
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.normal),
		type: 'paragraph',
		keymap: () => setNormalText,
	},
	{
		name: formatMessage(listMessages.orderedList),
		type: 'orderedList',
		keymap: () => toggleOrderedList,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<Box as="span" xcss={codeSm}>
					1.
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(listMessages.unorderedList),
		type: 'bulletList',
		keymap: () => toggleBulletList,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeSm}>
					*
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.blockquote),
		type: 'blockquote',
		keymap: () => toggleBlockQuote,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					{'>'}
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.codeblock),
		type: 'codeBlock',
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					```
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.horizontalRule),
		type: 'rule',
		keymap: () => insertRule,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<Box as="span" xcss={codeLg}>
					---
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.link),
		type: 'link',
		keymap: () => addLink,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					[
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...toolbarInsertBlockMessages.link}
					/>
					](http://a.com)
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarMessages.code),
		type: 'code',
		keymap: () => toggleCode,
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					`
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...toolbarMessages.code}
					/>
					`
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.action),
		type: 'taskItem',
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeSm}>
					[]
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.decision),
		type: 'decisionItem',
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<Box as="span" xcss={codeSm}>
					&lt;&gt;
				</Box>{' '}
				<Box as="span" xcss={codeLg}>
					Space
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.emoji),
		type: 'emoji',
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					:
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.mention),
		type: 'mention',
		autoFormatting: () => (
			<span>
				<Box as="span" xcss={codeLg}>
					@
				</Box>
			</span>
		),
	},
	{
		name: formatMessage(alignmentMessages.alignLeft),
		type: 'alignment',
		keymap: () => alignLeft,
	},

	{
		name: formatMessage(alignmentMessages.alignCenter),
		type: 'alignment',
		keymap: () => alignCenter,
	},
	{
		name: formatMessage(alignmentMessages.alignRight),
		type: 'alignment',
		keymap: () => alignRight,
	},
];

const quickInsertAskAI: (intl: IntlShape) => Format = ({ formatMessage }) => ({
	name: formatMessage(toolbarMessages.askAI),
	type: 'AI',
	keymap: () => askAIQuickInsert,
});

const otherFormatting: (intl: IntlShape) => Format[] = ({ formatMessage }) => {
	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;
	return [
		{
			name: formatMessage(toolbarMessages.clearFormatting),
			type: 'clearFormatting',
			keymap: () => clearFormatting,
		},
		{
			name: formatMessage(undoRedoMessages.undo),
			type: 'undo',
			keymap: () => undo,
		},
		{
			name: formatMessage(undoRedoMessages.redo),
			type: 'redo',
			keymap: () => (fg('platform_editor_cmd_y_mac_redo_shortcut') ? redoAlt : redo),
		},
		{
			name: formatMessage(messages.pastePlainText),
			type: 'paste',
			keymap: () => pastePlainText,
		},
		{
			name: formatMessage(annotationMessages.createComment),
			type: 'annotation',
			keymap: () => addInlineComment,
		},
		{
			name: formatMessage(messages.CheckUncheckActionItem),
			type: 'checkbox',
			keymap: () => toggleTaskItemCheckbox,
		},
		{
			name: formatMessage(messages.selectTableRow),
			type: 'table',
			autoFormatting: () => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				<span css={shortcutsArray}>
					<span>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={browser.mac ? codeSm : codeMd}>
							{browser.mac ? '⌘' : 'Ctrl'}
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeMd}>
							{browser.mac ? 'Opt' : 'Alt'}
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeMd}>
							Shift
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeSm}>
							←
						</Box>
					</span>
					<span>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={browser.mac ? codeSm : codeMd}>
							{browser.mac ? '⌘' : 'Ctrl'}
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeMd}>
							{browser.mac ? 'Opt' : 'Alt'}
						</Box>
						{' + '}
						<Box as="span" xcss={codeMd}>
							Shift
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeSm}>
							→
						</Box>
					</span>
				</span>
			),
		},
		{
			name: formatMessage(messages.selectTableColumn),
			type: 'table',
			autoFormatting: () => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				<span css={shortcutsArray}>
					<span>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={browser.mac ? codeSm : codeMd}>
							{browser.mac ? '⌘' : 'Ctrl'}
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeMd}>
							{browser.mac ? 'Opt' : 'Alt'}
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeMd}>
							Shift
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeSm}>
							↑
						</Box>
					</span>
					<span>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={browser.mac ? codeSm : codeMd}>
							{browser.mac ? '⌘' : 'Ctrl'}
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeMd}>
							{browser.mac ? 'Opt' : 'Alt'}
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeMd}>
							Shift
						</Box>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<Box as="span" xcss={codeSm}>
							↓
						</Box>
					</span>
				</span>
			),
		},
		...[
			{
				name: formatMessage(messages.InsertTableColumn),
				type: 'table',
				autoFormatting: () => (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					<span css={shortcutsArray}>
						<span>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={browser.mac ? codeSm : codeMd}>
								{browser.mac ? '⌘' : 'Ctrl'}
							</Box>
							{' + '}
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={codeMd}>
								{browser.mac ? 'Opt' : 'Alt'}
							</Box>
							{' + '}
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={codeSm}>
								=
							</Box>
						</span>
						<span>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={browser.mac ? codeSm : codeMd}>
								{browser.mac ? '⌘' : 'Ctrl'}
							</Box>
							{' + '}
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={codeMd}>
								{browser.mac ? 'Opt' : 'Alt'}
							</Box>
							{' + '}
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={codeSm}>
								-
							</Box>
						</span>
					</span>
				),
			},
			{
				name: formatMessage(messages.InsertTableRow),
				type: 'table',
				autoFormatting: () => (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					<span css={shortcutsArray}>
						<span>
							<Box as="span" xcss={browser.mac ? codeSm : codeMd}>
								{browser.mac ? '⌘' : 'Ctrl'}
							</Box>
							{' + '}
							<Box as="span" xcss={codeMd}>
								{browser.mac ? 'Opt' : 'Alt'}
							</Box>
							{' + '}
							<Box as="span" xcss={codeSm}>
								]
							</Box>
						</span>
						<span>
							<Box as="span" xcss={browser.mac ? codeSm : codeMd}>
								{browser.mac ? '⌘' : 'Ctrl'}
							</Box>
							{' + '}
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={codeMd}>
								{browser.mac ? 'Opt' : 'Alt'}
							</Box>
							{' + '}
							<Box as="span" xcss={codeSm}>
								[
							</Box>
						</span>
					</span>
				),
			},
		],
		...[
			{
				name: formatMessage(messages.selectColumnResize),
				type: 'table',
				autoFormatting: () => (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					<span css={shortcutsArray}>
						<span>
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={browser.mac ? codeSm : codeMd}>
								{browser.mac ? '⌘' : 'Ctrl'}
							</Box>
							{' + '}
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={codeMd}>
								{browser.mac ? 'Opt' : 'Alt'}
							</Box>
							{' + '}
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={codeMd}>
								Shift
							</Box>
							{' + '}
							{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
							<Box as="span" xcss={codeSm}>
								C
							</Box>
						</span>
					</span>
				),
			},
		],
		{
			name: formatMessage(messages.highlightColor),
			type: 'highlight',
			keymap: () => toggleHighlightPalette,
		},
	];
};

const resizeInformationFormatting: (intl: IntlShape) => Format[] = ({ formatMessage }) => [
	{
		name: formatMessage(messages.increaseSize),
		type: 'media',
		keymap: () => increaseMediaSize,
	},
	{
		name: formatMessage(messages.decreaseSize),
		type: 'media',
		keymap: () => decreaseMediaSize,
	},
];

const newResizeInformationFormatting: (intl: IntlShape) => Format[] = ({ formatMessage }) => [
	{
		name: formatMessage(messages.increaseElementSize),
		type: 'media',
		keymap: () => increaseMediaSize,
	},
	{
		name: formatMessage(messages.decreaseElementSize),
		type: 'media',
		keymap: () => decreaseMediaSize,
	},
];

const focusTableResizeHandleFormatting: (intl: IntlShape) => Format[] = ({ formatMessage }) => [
	{
		name: formatMessage(messages.focusTableResizeHandle),
		type: 'navigation',
		keymap: () => focusTableResizer,
	},
];

const openCellOptionsFormattingtoFormat: (intl: IntlShape) => Format[] = ({ formatMessage }) => [
	{
		name: formatMessage(messages.openCellOptions),
		type: 'image',
		keymap: () => focusToContextMenuTrigger,
	},
];

const imageAutoFormat: Format = {
	name: 'Image',
	type: 'image',
	autoFormatting: () => (
		<span>
			<Box as="span" xcss={codeLg}>
				![
				<FormattedMessage
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...messages.altText}
				/>
				](http://www.image.com)
			</Box>
		</span>
	),
};

const quickInsertAutoFormat: (intl: IntlShape) => Format = ({ formatMessage }) => ({
	name: formatMessage(messages.quickInsert),
	type: 'quickInsert',
	autoFormatting: () => (
		<span>
			<Box as="span" xcss={codeLg}>
				/
			</Box>
		</span>
	),
});

export const getSupportedFormatting = (
	schema: Schema,
	intl: IntlShape,
	imageEnabled?: boolean,
	quickInsertEnabled?: boolean,
	aiEnabled?: boolean,
): Format[] => {
	const supportedBySchema = formatting(intl).filter(
		(format) => schema.nodes[format.type] || schema.marks[format.type],
	);

	return [
		...(aiEnabled && editorExperiment('platform_editor_ai_quickstart_command', true)
			? [quickInsertAskAI(intl)]
			: []),
		...navigationKeymaps(intl),
		...otherFormatting(intl),
		...supportedBySchema,
		...(imageEnabled ? [imageAutoFormat] : []),
		...(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []),
		...focusTableResizeHandleFormatting(intl),
		...(editorExperiment('platform_editor_breakout_resizing', true)
			? newResizeInformationFormatting(intl)
			: resizeInformationFormatting(intl)),
		...openCellOptionsFormattingtoFormat(intl),
	];
};
