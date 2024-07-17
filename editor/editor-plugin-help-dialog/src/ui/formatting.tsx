/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next';
import { FormattedMessage } from 'react-intl-next';

import {
	addInlineComment,
	addLink,
	alignCenter,
	alignLeft,
	alignRight,
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
import { browser } from '@atlaskit/editor-common/utils';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { Format } from './Format';
import { codeLg, codeMd, codeSm, shortcutsArray } from './styles';

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
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>
					**
					<FormattedMessage {...toolbarMessages.bold} />
					**
				</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarMessages.italic),
		type: 'em',
		keymap: () => toggleItalic,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>
					*<FormattedMessage {...toolbarMessages.italic} />*
				</span>
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
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>
					~~
					<FormattedMessage {...toolbarMessages.strike} />
					~~
				</span>
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
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeSm}>#</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading2),
		type: 'heading',
		keymap: () => toggleHeading2,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>##</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading3),
		type: 'heading',
		keymap: () => toggleHeading3,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>###</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading4),
		type: 'heading',
		keymap: () => toggleHeading4,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>####</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading5),
		type: 'heading',
		keymap: () => toggleHeading5,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>#####</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.heading6),
		type: 'heading',
		keymap: () => toggleHeading6,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>######</span> <span css={codeLg}>Space</span>
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
				<span css={codeSm}>1.</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(listMessages.unorderedList),
		type: 'bulletList',
		keymap: () => toggleBulletList,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeSm}>*</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.blockquote),
		type: 'blockquote',
		keymap: () => toggleBlockQuote,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>{'>'}</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.codeblock),
		type: 'codeBlock',
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>```</span>
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
				<span css={codeLg}>---</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.link),
		type: 'link',
		keymap: () => addLink,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>
					[<FormattedMessage {...toolbarInsertBlockMessages.link} />
					](http://a.com)
				</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarMessages.code),
		type: 'code',
		keymap: () => toggleCode,
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>
					`<FormattedMessage {...toolbarMessages.code} />`
				</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.action),
		type: 'taskItem',
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeSm}>[]</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.decision),
		type: 'decisionItem',
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeSm}>&lt;&gt;</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.emoji),
		type: 'emoji',
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>:</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.mention),
		type: 'mention',
		autoFormatting: () => (
			<span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={codeLg}>@</span>
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

const otherFormatting: (intl: IntlShape) => Format[] = ({ formatMessage }) => [
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
		keymap: () => redo,
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
					<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeMd}>Shift</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeSm}>←</span>
				</span>
				<span>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeMd}>Shift</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeSm}>→</span>
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
					<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeMd}>Shift</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeSm}>↑</span>
				</span>
				<span>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeMd}>Shift</span>
					{' + '}
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<span css={codeSm}>↓</span>
				</span>
			</span>
		),
	},
	...(fg('platform.editor.a11y-help-dialog-shortcut-keys-position_aghfg')
		? [
				{
					name: formatMessage(messages.InsertTableColumn),
					type: 'table',
					autoFormatting: () => (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						<span css={shortcutsArray}>
							<span>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>=</span>
							</span>
							<span>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>-</span>
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
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>]</span>
							</span>
							<span>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>[</span>
							</span>
						</span>
					),
				},
			]
		: [
				{
					name: formatMessage(messages.InsertTableColumn),
					type: 'table',
					autoFormatting: () => (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						<span css={shortcutsArray}>
							<span>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>{browser.mac ? '⌃' : 'Ctrl'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>→</span>
							</span>
							<span>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>{browser.mac ? '⌃' : 'Ctrl'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>←</span>
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
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>{browser.mac ? '⌃' : 'Ctrl'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>↓</span>
							</span>
							<span>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>{browser.mac ? '⌃' : 'Ctrl'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={codeSm}>↑</span>
							</span>
						</span>
					),
				},
			]),
	...[
		{
			name: formatMessage(messages.selectColumnResize),
			type: 'table',
			autoFormatting: () => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				<span css={shortcutsArray}>
					<span>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<span css={codeMd}>Shift</span>
						{' + '}
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
						<span css={codeSm}>C</span>
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
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<span css={codeLg}>
				![
				<FormattedMessage {...messages.altText} />
				](http://www.image.com)
			</span>
		</span>
	),
};

const quickInsertAutoFormat: (intl: IntlShape) => Format = ({ formatMessage }) => ({
	name: formatMessage(messages.quickInsert),
	type: 'quickInsert',
	autoFormatting: () => (
		<span>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<span css={codeLg}>/</span>
		</span>
	),
});

export const getSupportedFormatting = (
	schema: Schema,
	intl: IntlShape,
	imageEnabled?: boolean,
	quickInsertEnabled?: boolean,
): Format[] => {
	const supportedBySchema = formatting(intl).filter(
		(format) => schema.nodes[format.type] || schema.marks[format.type],
	);

	return fg('platform_editor_a11y_table_context_menu')
		? [
				...navigationKeymaps(intl),
				...otherFormatting(intl),
				...supportedBySchema,
				...(imageEnabled ? [imageAutoFormat] : []),
				...(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []),
				...focusTableResizeHandleFormatting(intl),
				...resizeInformationFormatting(intl),
				...openCellOptionsFormattingtoFormat(intl),
			]
		: [
				...navigationKeymaps(intl),
				...otherFormatting(intl),
				...supportedBySchema,
				...(imageEnabled ? [imageAutoFormat] : []),
				...(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []),
				...focusTableResizeHandleFormatting(intl),
				...resizeInformationFormatting(intl),
			];
};
