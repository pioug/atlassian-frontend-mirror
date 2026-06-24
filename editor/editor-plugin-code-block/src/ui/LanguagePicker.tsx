/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import type { IntlShape } from 'react-intl';

import Button from '@atlaskit/button/new';
import { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';
import type { SelectOption } from '@atlaskit/editor-common/types';
import { akEditorLineHeight } from '@atlaskit/editor-shared-styles';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
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

import {
	createGroupedLanguageOptions,
	type LanguagePickerOption,
	type LanguagePickerOptionGroup,
	type LanguagePickerSelectionSource,
} from './language-picker-options';

export type LanguagePickerProps = {
	defaultValue?: LanguagePickerOption;
	filterOption: (option: SelectOption<LanguagePickerOption>, rawInput: string) => boolean;
	formatMessage: IntlShape['formatMessage'];
	languagePickerOptions: LanguagePickerOption[];
	onMenuOpen?: () => void;
	onSelection: (
		option: LanguagePickerOption,
		selectionSource: LanguagePickerSelectionSource,
	) => void;
	recentLanguageValues?: string[];
	triggerSpacing?: 'default' | 'compact';
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
		maxWidth: '200px',
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
type PopupSelectPopperProps = NonNullable<PopupSelectProps['popperProps']>;
type PopupSelectPopperPlacement = PopupSelectPopperProps['placement'];

const menuPopperProps: PopupSelectPopperProps = {
	modifiers: [
		{ name: 'offset', options: { offset: [0, 8] } },
		{ name: 'preventOverflow', enabled: false },
	],
};

const focusWithoutScrolling = (element: HTMLElement) => {
	element.focus({ preventScroll: true });
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
	defaultValue,
	filterOption,
	formatMessage,
	languagePickerOptions,
	recentLanguageValues = [],
	onMenuOpen,
	onSelection,
	triggerSpacing = 'default',
}: LanguagePickerProps): React.JSX.Element => {
	const label = defaultValue?.label ?? formatMessage(codeBlockButtonMessages.selectLanguage);
	const selectLanguageLabel = formatMessage(codeBlockButtonMessages.selectLanguage);
	const [hasSearchQuery, setHasSearchQuery] = useState(false);
	const [lockedPopperPlacement, setLockedPopperPlacement] = useState<PopupSelectPopperPlacement>();
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
	const stableMenuPopperProps = useMemo<PopupSelectPopperProps>(
		() => ({
			// Allow Popper to choose top on the first open when bottom has no room, then lock the
			// chosen placement so later hover/search renders do not move the open picker.
			placement: lockedPopperPlacement ?? 'bottom-start',
			modifiers: [
				{ name: 'offset', options: { offset: [0, 8] } },
				{ name: 'preventOverflow', enabled: false },
				...(lockedPopperPlacement ? [{ name: 'flip', enabled: false } as const] : []),
			],
			onFirstUpdate: ({ placement }) => {
				setLockedPopperPlacement(placement);
			},
		}),
		[lockedPopperPlacement],
	);
	const handleChange = useCallback(
		(option: ValueType<LanguagePickerOption>) => {
			if (!option) {
				return;
			}

			const isSearchSelection = inputValueRef.current.trim().length > 0;
			const selectionSource: LanguagePickerSelectionSource = isSearchSelection
				? 'search'
				: (option.selectionSource ?? 'all');

			onSelection(option, selectionSource);
		},
		[onSelection],
	);
	const handleInputChange = useCallback(
		(newInputValue: string, actionMeta?: { action?: string }) => {
			// React-select clears the input as part of selecting a value before onChange fires.
			// Keep the last user-typed query so handleChange can report search selections correctly.
			const isInputChange = !actionMeta || actionMeta.action === 'input-change';
			if (isInputChange) {
				inputValueRef.current = newInputValue;
			}
			if (isInputChange || !fg('platform_editor_code_block_dogfooding_patch')) {
				setHasSearchQuery(newInputValue.trim().length > 0);
				return newInputValue;
			}
			return inputValueRef.current;
		},
		[],
	);
	const handleMenuOpen = useCallback(() => {
		if (fg('platform_editor_code_block_dogfooding_patch')) {
			inputValueRef.current = '';
			setHasSearchQuery(false);
			setLockedPopperPlacement(undefined);
		}
		onMenuOpen?.();
	}, [onMenuOpen]);
	const handleTriggerMouseDown = useCallback((event: React.MouseEvent<HTMLElement>) => {
		if (fg('platform_editor_code_block_dogfooding_patch')) {
			// PopupSelect's FocusLock returns focus to the element that was focused before the
			// picker opened. If that is the editor/code block, closing the picker can scroll the
			// whole code block into view. Focus the trigger first without scrolling so FocusLock
			// returns to the trigger; see CodeBlockLanguagePicker's handleSelection for restoring
			// editor focus.
			focusWithoutScrolling(event.currentTarget);
		}
	}, []);
	const renderTarget = useCallback(
		({ isOpen, ref, onKeyDown, 'aria-controls': ariaControls }: PopupSelectTargetProps) => (
			<div css={styles.trigger}>
				<Button
					spacing={triggerSpacing}
					shouldFitContainer
					onMouseDown={handleTriggerMouseDown}
					onKeyDown={onKeyDown}
					ref={ref}
					iconAfter={ChevronDownIcon}
					appearance="subtle"
					isSelected={isOpen}
					aria-controls={ariaControls}
					testId="code-block-language-picker-trigger"
				>
					{label}
				</Button>
			</div>
		),
		[label, triggerSpacing, handleTriggerMouseDown],
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
			onMenuOpen={handleMenuOpen}
			options={hasSearchQuery ? searchOptions : options}
			popperProps={
				fg('platform_editor_code_block_dogfooding_patch') ? stableMenuPopperProps : menuPopperProps
			}
			searchThreshold={-1}
			target={renderTarget}
			testId="code-block-language-picker"
			defaultValue={defaultValue}
		/>
	);
};
