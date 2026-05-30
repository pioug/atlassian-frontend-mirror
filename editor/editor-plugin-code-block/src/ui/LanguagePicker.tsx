/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import type { IntlShape } from 'react-intl';

import Button from '@atlaskit/button/new';
import { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI, SelectOption } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorLineHeight } from '@atlaskit/editor-shared-styles';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { Box } from '@atlaskit/primitives/compiled';
import {
	PopupSelect,
	components,
	type GroupProps,
	type OptionProps,
	type PopupSelectProps,
	type ValueType,
} from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { changeLanguage } from '../editor-commands';
import type { CodeBlockPlugin } from '../index';

import type {
	LanguagePickerOption,
	LanguagePickerOptionGroup,
	LanguagePickerSelectionSource,
} from './language-picker-options';
import { createGroupedLanguageOptions } from './language-picker-options';

export type LanguagePickerProps = {
	api: ExtractInjectionAPI<CodeBlockPlugin> | undefined;
	defaultValue?: LanguagePickerOption;
	editorView: EditorView;
	filterOption: (option: SelectOption<LanguagePickerOption>, rawInput: string) => boolean;
	formatMessage: IntlShape['formatMessage'];
	languagePickerOptions: LanguagePickerOption[];
	onLanguageSelect?: (language: string) => void;
	onMenuOpen?: () => void;
	recentLanguageValues?: string[];
};

const pickerOptionStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	lineHeight: akEditorLineHeight,
});

const styles = cssMap({
	divider: {
		width: '100%',
		borderBlockEnd: 'none',
		borderBlockStart: `${token('border.width')} solid ${token('color.border')}`,
		borderInline: 'none',
	},

	trigger: {
		width: '200px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		button: {
			textAlign: 'left',

			'&::after': {
				// Remove blue outline when picker is open
				content: 'none',
			},
		},
	},
});

const CustomGroup = (props: GroupProps<LanguagePickerOption, false>): React.JSX.Element => {
	const allGroups = props.selectProps.options as LanguagePickerOptionGroup[];
	const isFirstGroup = allGroups.length > 0 && allGroups[0] === props.data;

	return (
		<Fragment>
			{!isFirstGroup && <Box as="hr" xcss={styles.divider} role="presentation" />}
			{/* eslint-disable-next-line react/jsx-props-no-spreading -- react-select custom components must forward all props to the default Group. */}
			<components.Group {...props} />
		</Fragment>
	);
};

const CustomOption = (props: OptionProps<LanguagePickerOption, false>): React.JSX.Element => {
	return (
		// eslint-disable-next-line react/jsx-props-no-spreading -- react-select custom components must forward all props to the default Option.
		<components.Option {...props}>
			<span css={pickerOptionStyles}>{props.children}</span>
		</components.Option>
	);
};
const popupSelectComponents = { Group: CustomGroup, Option: CustomOption };

type PopupSelectTarget = NonNullable<PopupSelectProps<LanguagePickerOption>['target']>;
type PopupSelectTargetProps = Parameters<PopupSelectTarget>[0];

const menuPopperProps: NonNullable<PopupSelectProps['popperProps']> = {
	modifiers: [
		{ name: 'offset', options: { offset: [0, 8] } },
		{ name: 'preventOverflow', enabled: false },
	],
};

const getRecentlyUsedLanguages = (
	recentLanguageValues: string[],
	optionsByValue: Map<string, LanguagePickerOption>,
): LanguagePickerOption[] => {
	const recentlyUsedLanguages: LanguagePickerOption[] = [];

	for (const recentLanguageValue of recentLanguageValues) {
		const option = optionsByValue.get(recentLanguageValue);

		if (option) {
			recentlyUsedLanguages.push(option);
		}
	}

	return recentlyUsedLanguages;
};

export const LanguagePicker = ({
	api,
	defaultValue,
	editorView,
	filterOption,
	formatMessage,
	languagePickerOptions,
	recentLanguageValues = [],
	onLanguageSelect,
	onMenuOpen,
}: LanguagePickerProps): React.JSX.Element => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const label = defaultValue?.label ?? formatMessage(codeBlockButtonMessages.selectLanguage);
	const selectLanguageLabel = formatMessage(codeBlockButtonMessages.selectLanguage);
	const [hasSearchQuery, setHasSearchQuery] = useState(false);
	const inputValueRef = useRef('');
	const optionsByValue = useMemo(
		() => new Map(languagePickerOptions.map((option) => [option.value, option])),
		[languagePickerOptions],
	);
	const recentlyUsedLanguages = useMemo(
		() => getRecentlyUsedLanguages(recentLanguageValues, optionsByValue),
		[recentLanguageValues, optionsByValue],
	);
	const options = useMemo<LanguagePickerOptionGroup[]>(
		() =>
			createGroupedLanguageOptions({
				formatMessage,
				languages: languagePickerOptions,
				recentlyUsedLanguages,
			}),
		[formatMessage, languagePickerOptions, recentlyUsedLanguages],
	);
	const searchOptions = useMemo(() => options.flatMap((group) => group.options), [options]);
	const handleChange = useCallback(
		(option: ValueType<LanguagePickerOption>) => {
			if (!option) {
				return;
			}

			const isSearchSelection = inputValueRef.current.trim().length > 0;
			const selectionSource: LanguagePickerSelectionSource = isSearchSelection
				? 'search'
				: (option.selectionSource ?? 'all');
			const commandSucceeded = changeLanguage(editorAnalyticsAPI)(option.value, selectionSource)(
				editorView.state,
				editorView.dispatch,
			);

			if (commandSucceeded) {
				onLanguageSelect?.(option.value);
			}
		},
		[editorAnalyticsAPI, editorView, onLanguageSelect],
	);
	const handleInputChange = useCallback(
		(newInputValue: string, actionMeta?: { action?: string }) => {
			// React-select clears the input as part of selecting a value before onChange fires.
			// Keep the last user-typed query so handleChange can report search selections correctly.
			if (!actionMeta || actionMeta.action === 'input-change') {
				inputValueRef.current = newInputValue;
			}
			setHasSearchQuery(newInputValue.trim().length > 0);
			return newInputValue;
		},
		[],
	);
	const renderTarget = useCallback(
		({ isOpen, ref, onKeyDown, 'aria-controls': ariaControls }: PopupSelectTargetProps) => (
			<div css={styles.trigger}>
				<Button
					shouldFitContainer
					onKeyDown={onKeyDown}
					ref={ref}
					iconAfter={ChevronDownIcon}
					appearance="subtle"
					isSelected={isOpen}
					aria-controls={ariaControls}
					aria-label={selectLanguageLabel}
					testId="code-block-language-picker-trigger"
				>
					{label}
				</Button>
			</div>
		),
		[label, selectLanguageLabel],
	);

	return (
		<PopupSelect<LanguagePickerOption>
			components={popupSelectComponents}
			filterOption={filterOption}
			label={selectLanguageLabel}
			maxMenuHeight={300}
			minMenuWidth={200}
			menuPlacement="auto"
			onChange={handleChange}
			onInputChange={handleInputChange}
			onMenuOpen={onMenuOpen}
			options={hasSearchQuery ? searchOptions : options}
			popperProps={menuPopperProps}
			searchThreshold={-1}
			target={renderTarget}
			testId="code-block-language-picker"
			defaultValue={defaultValue}
		/>
	);
};
