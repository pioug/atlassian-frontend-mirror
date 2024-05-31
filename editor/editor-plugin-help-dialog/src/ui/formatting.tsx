/** @jsx jsx */
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
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type Format from './Format';
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
				<span css={codeLg}>{'>'}</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(blockTypeMessages.codeblock),
		type: 'codeBlock',
		autoFormatting: () => (
			<span>
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
				<span css={codeSm}>[]</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.decision),
		type: 'decisionItem',
		autoFormatting: () => (
			<span>
				<span css={codeSm}>&lt;&gt;</span> <span css={codeLg}>Space</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.emoji),
		type: 'emoji',
		autoFormatting: () => (
			<span>
				<span css={codeLg}>:</span>
			</span>
		),
	},
	{
		name: formatMessage(toolbarInsertBlockMessages.mention),
		type: 'mention',
		autoFormatting: () => (
			<span>
				<span css={codeLg}>@</span>
			</span>
		),
	},
	{
		name: formatMessage(alignmentMessages.alignLeft),
		type: 'alignment',
		keymap: () => alignLeft,
	},
	...(getBooleanFF('platform.editor.text-alignment-keyboard-shortcuts')
		? [
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
			]
		: []),
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
			<span css={shortcutsArray}>
				<span>
					<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
					{' + '}
					<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
					{' + '}
					<span css={codeMd}>Shift</span>
					{' + '}
					<span css={codeSm}>←</span>
				</span>
				<span>
					<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
					{' + '}
					<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
					{' + '}
					<span css={codeMd}>Shift</span>
					{' + '}
					<span css={codeSm}>→</span>
				</span>
			</span>
		),
	},
	{
		name: formatMessage(messages.selectTableColumn),
		type: 'table',
		autoFormatting: () => (
			<span css={shortcutsArray}>
				<span>
					<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
					{' + '}
					<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
					{' + '}
					<span css={codeMd}>Shift</span>
					{' + '}
					<span css={codeSm}>↑</span>
				</span>
				<span>
					<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
					{' + '}
					<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
					{' + '}
					<span css={codeMd}>Shift</span>
					{' + '}
					<span css={codeSm}>↓</span>
				</span>
			</span>
		),
	},
	...(getBooleanFF('platform.editor.a11y-column-resizing_emcvz')
		? [
				{
					name: formatMessage(messages.selectColumnResize),
					type: 'table',
					autoFormatting: () => (
						<span css={shortcutsArray}>
							<span>
								<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
								{' + '}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								<span css={codeMd}>Shift</span>
								{' + '}
								<span css={codeSm}>C</span>
							</span>
						</span>
					),
				},
				{
					name: formatMessage(messages.increaseColumnSize),
					type: 'table',
					autoFormatting: () => (
						<span css={shortcutsArray}>
							<span>
								<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
								{' + '}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								<span css={codeMd}>[</span>
							</span>
						</span>
					),
				},
				{
					name: formatMessage(messages.decreaseColumnSize),
					type: 'table',
					autoFormatting: () => (
						<span css={shortcutsArray}>
							<span>
								<span css={browser.mac ? codeSm : codeMd}>{browser.mac ? '⌘' : 'Ctrl'}</span>
								{' + '}
								<span css={codeMd}>{browser.mac ? 'Opt' : 'Alt'}</span>
								{' + '}
								<span css={codeMd}>]</span>
							</span>
						</span>
					),
				},
			]
		: []),
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

const imageAutoFormat: Format = {
	name: 'Image',
	type: 'image',
	autoFormatting: () => (
		<span>
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
			<span css={codeLg}>/</span>
		</span>
	),
});

const isAnyA11yResizeFeatureFlagEnabled =
	getBooleanFF('platform.editor.a11y-media-resizing_b5v0o') ||
	getBooleanFF('platform.editor.a11y-table-resizing_uapcv');

export const getSupportedFormatting = (
	schema: Schema,
	intl: IntlShape,
	imageEnabled?: boolean,
	quickInsertEnabled?: boolean,
): Format[] => {
	const supportedBySchema = formatting(intl).filter(
		(format) => schema.nodes[format.type] || schema.marks[format.type],
	);
	return [
		...navigationKeymaps(intl),
		...supportedBySchema,
		...(imageEnabled ? [imageAutoFormat] : []),
		...(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []),
		...otherFormatting(intl),
		...(isAnyA11yResizeFeatureFlagEnabled ? resizeInformationFormatting(intl) : []),
		...(getBooleanFF('platform.editor.a11y-table-resizing_uapcv')
			? focusTableResizeHandleFormatting(intl)
			: []),
	];
};
