import React from 'react';

import type { IntlShape } from 'react-intl';

import {
	areCodeBlockLineNumbersVisible,
	isCodeBlockWordWrapEnabled,
} from '@atlaskit/editor-common/code-block';
import commonMessages, { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarButton,
	FloatingToolbarCustom,
	FloatingToolbarHandler,
	FloatingToolbarItem,
	FloatingToolbarListPicker,
	FloatingToolbarOverflowDropdownOptions,
	FloatingToolbarSeparator,
	SelectOption,
} from '@atlaskit/editor-common/types';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import CopyIcon from '@atlaskit/icon/core/copy';
import DeleteIcon from '@atlaskit/icon/core/delete';
import ListNumberedIcon from '@atlaskit/icon/core/list-numbered';
import TextWrapIcon from '@atlaskit/icon/core/text-wrap';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	changeLanguage,
	copyContentToClipboardWithAnalytics,
	createFormatCodeOnClick,
	removeCodeBlockWithAnalytics,
	resetCopiedState,
	toggleLineNumbersForCodeBlockNode,
	toggleWordWrapStateForCodeBlockNode,
} from '../editor-commands';
import type { CodeBlockPlugin } from '../index';
import { CodeBlockLanguagePicker } from '../ui/CodeBlockLanguagePicker';
import { WrapIcon } from '../ui/icons/WrapIcon';
import {
	NONE_LANGUAGE_VALUE,
	PLAIN_TEXT_LANGUAGE_VALUE,
	type LanguagePickerOption,
} from '../ui/language-picker-options';
import {
	isSupportedFormatLanguage,
	preloadFormatterOnIntent,
} from '../utils/format-code/formatter';

import { autoDetectPluginKey, type AutoDetectEntry } from './auto-detect-state';
import {
	provideVisualFeedbackForCopyButton,
	removeVisualFeedbackForCopyButton,
} from './codeBlockCopySelectionPlugin';
import { createLanguageList, DEFAULT_LANGUAGES, getLanguageIdentifier } from './language-list';
import type { Language } from './language-list';
import type { CodeBlockState } from './main-state';
import { pluginKey } from './plugin-key';

const getAutoDetectPickerValue = ({
	autoDetectEntry,
	formatMessage,
	language,
	languagePickerOptions,
}: {
	autoDetectEntry?: AutoDetectEntry;
	formatMessage: IntlShape['formatMessage'];
	language: string | undefined;
	languagePickerOptions: LanguagePickerOption[];
}): LanguagePickerOption | undefined => {
	const defaultPickerValue = language
		? languagePickerOptions.find((option) =>
				language === NONE_LANGUAGE_VALUE
					? option.value === PLAIN_TEXT_LANGUAGE_VALUE
					: option.value === language || option.alias.includes(language),
			)
		: undefined;

	// A weak re-detection records noneDetected but can leave a previously auto-detected
	// language on the node. Keep showing "(detected)" only while that preserved language
	// still matches the node language, so manual language changes do not inherit the label.
	if (
		defaultPickerValue &&
		(autoDetectEntry?.detectionResult === 'detected' ||
			(autoDetectEntry?.detectionResult === 'noneDetected' &&
				autoDetectEntry.autoDetectedLanguage === language))
	) {
		return {
			...defaultPickerValue,
			label: formatMessage(codeBlockButtonMessages.detectedLanguage, {
				language: defaultPickerValue.label,
			}) as string,
		};
	}

	if (autoDetectEntry?.detectionResult === 'noneDetected' && !language) {
		return {
			alias: [],
			label: formatMessage(codeBlockButtonMessages.noneDetected),
			value: NONE_LANGUAGE_VALUE,
		};
	}

	return defaultPickerValue;
};

export const getToolbarConfig = (
	allowCopyToClipboard: boolean = false,
	api: ExtractInjectionAPI<CodeBlockPlugin> | undefined,
	overrideLanguageName: ((name: Language['name']) => string) | undefined = undefined,
): FloatingToolbarHandler => {
	const languageList = createLanguageList(
		overrideLanguageName
			? DEFAULT_LANGUAGES.map(
					(languageOption) =>
						({
							...languageOption,
							name: overrideLanguageName(languageOption.name),
						}) as Language,
				)
			: DEFAULT_LANGUAGES,
	);
	const languagePickerOptions: LanguagePickerOption[] = languageList.map((lang) => ({
		label: lang.name,
		value: getLanguageIdentifier(lang),
		alias: lang.alias,
	}));

	return (state, { formatMessage }) => {
		const isViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';

		const { hoverDecoration } = api?.decorations?.actions ?? {};
		const editorAnalyticsAPI = api?.analytics?.actions;

		const codeBlockState: CodeBlockState | undefined = pluginKey.getState(state);
		const pos = codeBlockState?.pos ?? null;

		if (!codeBlockState || pos === null) {
			return;
		}

		const node = state.doc.nodeAt(pos);
		const nodeType = state.schema.nodes.codeBlock;

		if (node?.type !== nodeType) {
			return;
		}
		const isWrapped = isCodeBlockWordWrapEnabled(node);
		const areLineNumbersVisible = areCodeBlockLineNumbersVisible(node);
		const language = node?.attrs?.language;
		const localId = node?.attrs?.localId;
		const autoDetectState = autoDetectPluginKey.getState(state);

		const isFormatCodePending =
			typeof localId === 'string' && Boolean(codeBlockState.pendingFormats[localId]);
		// Keep fresh option objects for the legacy toolbar select so reopening it
		// continues to start from the top rather than preserving the previously
		// focused option by reference.
		const languageSelectOptions: LanguagePickerOption[] = languagePickerOptions.map((option) => ({
			...option,
		}));
		const defaultValue = language
			? languageSelectOptions.find((option) => option.value === language) ||
				languageSelectOptions.find((option) => option.alias.includes(language as never))
			: null;

		const languageSelect: FloatingToolbarListPicker<Command> = {
			id: 'editor.codeBlock.languageOptions',
			type: 'select',
			selectType: 'list',
			onChange: (option) => changeLanguage(editorAnalyticsAPI)(option.value),
			defaultValue,
			placeholder: formatMessage(codeBlockButtonMessages.selectLanguage),
			options: languageSelectOptions,
			filterOption: languageListFilter,
		};

		let languagePicker: FloatingToolbarCustom<Command> | undefined;

		if (
			expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true) &&
			fg('platform_editor_code_block_add_line_number_button')
		) {
			const autoDetectEntry =
				typeof localId === 'string' && fg('platform_editor_code_block_language_detection_flow')
					? autoDetectState?.languageDetectionMap[localId]
					: undefined;
			const autoDetectPickerValue = getAutoDetectPickerValue({
				autoDetectEntry,
				formatMessage,
				language,
				languagePickerOptions,
			});

			languagePicker = {
				type: 'custom',
				fallback: [],
				render: (view) => {
					if (!view) {
						return null;
					}

					return (
						<CodeBlockLanguagePicker
							api={api}
							defaultValue={autoDetectPickerValue}
							editorView={view}
							filterOption={languageListFilter}
							formatMessage={formatMessage}
							languagePickerOptions={languagePickerOptions}
						/>
					);
				},
			};
		}

		const separator: FloatingToolbarSeparator = {
			type: 'separator',
		};

		const areAnyNewToolbarFlagsEnabled = areToolbarFlagsEnabled(Boolean(api?.toolbar));

		const copyToClipboardItems = !allowCopyToClipboard
			? []
			: ([
					{
						id: 'editor.codeBlock.copy',
						type: 'button',
						supportsViewMode: true,
						appearance: 'subtle',
						icon: CopyIcon,
						// note: copyContentToClipboardWithAnalytics contains logic that also removes the
						// visual feedback for the copy button
						onClick: copyContentToClipboardWithAnalytics(editorAnalyticsAPI),
						title: formatMessage(
							codeBlockState.contentCopied
								? codeBlockButtonMessages.copiedCodeToClipboard
								: codeBlockButtonMessages.copyCodeToClipboard,
						),
						onMouseEnter: provideVisualFeedbackForCopyButton,
						// note: resetCopiedState contains logic that also removes the
						// visual feedback for the copy button
						onMouseLeave: resetCopiedState,
						onFocus: provideVisualFeedbackForCopyButton,
						onBlur: removeVisualFeedbackForCopyButton,
						hideTooltipOnClick: false,
						disabled: codeBlockState.isNodeSelected,
						tabIndex: null,
					},
					separator,
				] as const);

		let copyAndDeleteButtonMenuItems: FloatingToolbarItem<Command>[] = [];
		if (areAnyNewToolbarFlagsEnabled) {
			const overflowMenuOptions: FloatingToolbarOverflowDropdownOptions<Command> = [
				{
					title: formatMessage(commonMessages.delete),
					icon: DeleteIcon({ label: '' }),
					onMouseEnter: hoverDecoration?.(nodeType, true),
					onMouseLeave: hoverDecoration?.(nodeType, false),
					onFocus: hoverDecoration?.(nodeType, true),
					onBlur: hoverDecoration?.(nodeType, false),
					onClick: removeCodeBlockWithAnalytics(editorAnalyticsAPI),
				},
			];

			if (allowCopyToClipboard) {
				overflowMenuOptions.unshift({
					title: formatMessage(commonMessages.copyToClipboard),
					onClick: copyContentToClipboardWithAnalytics(editorAnalyticsAPI),
					icon: CopyIcon({ label: '' }),
					onMouseEnter: provideVisualFeedbackForCopyButton,
					onMouseLeave: resetCopiedState,
					onFocus: provideVisualFeedbackForCopyButton,
					onBlur: removeVisualFeedbackForCopyButton,
					disabled: codeBlockState.isNodeSelected,
				});
			}

			copyAndDeleteButtonMenuItems = isViewMode
				? [...copyToClipboardItems]
				: [
						{ type: 'separator', fullHeight: true },
						{
							type: 'overflow-dropdown',
							testId: 'code-block-overflow-dropdown-trigger',
							options: overflowMenuOptions,
						},
					];
		} else {
			const deleteButton: FloatingToolbarButton<Command> = {
				id: 'editor.codeBlock.delete',
				type: 'button',
				appearance: 'danger',
				icon: DeleteIcon,
				iconFallback: DeleteIcon,
				onMouseEnter: hoverDecoration?.(nodeType, true),
				onMouseLeave: hoverDecoration?.(nodeType, false),
				onFocus: hoverDecoration?.(nodeType, true),
				onBlur: hoverDecoration?.(nodeType, false),
				onClick: removeCodeBlockWithAnalytics(editorAnalyticsAPI),
				title: formatMessage(commonMessages.remove),
				tabIndex: null,
			};
			copyAndDeleteButtonMenuItems = [separator, ...copyToClipboardItems, deleteButton];
		}

		const codeBlockWrapButtonTitle = expValEquals(
			'platform_editor_code_block_q4_lovability',
			'isEnabled',
			true,
		)
			? formatMessage(
					isWrapped
						? codeBlockButtonMessages.unwrapCodeLabel
						: codeBlockButtonMessages.wrapCodeLabel,
				)
			: formatMessage(codeBlockButtonMessages.wrapCode);

		const codeBlockWrapButton: FloatingToolbarButton<Command> = {
			id: 'editor.codeBlock.wrap',
			type: 'button',
			// Toggling button now writes to ADF, hence it should be available in view mode
			supportsViewMode: !expValEquals(
				'platform_editor_code_block_q4_lovability',
				'isEnabled',
				true,
			),
			icon: TextWrapIcon,
			iconFallback: WrapIcon,
			onClick: toggleWordWrapStateForCodeBlockNode(editorAnalyticsAPI),
			title: codeBlockWrapButtonTitle,
			tabIndex: null,
			selected: isWrapped,
		};

		const codeBlockLineNumbersButton: FloatingToolbarButton<Command> = {
			id: 'editor.codeBlock.lineNumbers',
			type: 'button',
			supportsViewMode: false,
			icon: ListNumberedIcon,
			onClick: toggleLineNumbersForCodeBlockNode(editorAnalyticsAPI),
			title: formatMessage(
				areLineNumbersVisible
					? codeBlockButtonMessages.hideLineNumbersLabel
					: codeBlockButtonMessages.showLineNumbersLabel,
			),
			tabIndex: null,
			selected: areLineNumbersVisible,
		};

		const canFormatCode = node.textContent.length > 0 && isSupportedFormatLanguage(language);
		const formatCodeButton: FloatingToolbarButton<Command> = {
			id: 'editor.codeBlock.formatCode',
			type: 'button',
			supportsViewMode: false,
			disabled: !canFormatCode || isFormatCodePending,
			icon: AngleBracketsIcon,
			onClick: createFormatCodeOnClick({ api, editorAnalyticsAPI }),
			onFocus: preloadFormatterOnIntent(),
			onMouseEnter: preloadFormatterOnIntent(),
			title: formatMessage(
				canFormatCode
					? codeBlockButtonMessages.formatCode
					: codeBlockButtonMessages.formatCodeUnavailable,
			),
		};
		return {
			title: 'CodeBlock floating controls',
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			getDomRef: (view) => findDomRefAtPos(pos, view.domAtPos.bind(view)) as HTMLElement,
			nodeType,
			items: [
				languagePicker ?? languageSelect,
				...(areAnyNewToolbarFlagsEnabled ? [] : [separator]),
				codeBlockWrapButton,
				...(expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true) &&
				fg('platform_editor_code_block_add_line_number_button')
					? [codeBlockLineNumbersButton, formatCodeButton]
					: []),
				...copyAndDeleteButtonMenuItems,
			],
			scrollable: true,
		};
	};
};

/**
 * Filters language list based on both name and alias properties.
 * @param option
 * @param rawInput
 * @example
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const languageListFilter = (option: SelectOption, rawInput: string): any => {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data } = option as any;
	const searchString = rawInput.toLowerCase();
	return (
		data.label.toLowerCase().includes(searchString) ||
		data.alias.some((alias: string) => alias.toLowerCase() === searchString)
	);
};
