/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import BoardIcon from '@atlaskit/icon/glyph/board';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { type DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';
import {
	CheckboxOption,
	createFilter,
	type ModifierList,
	type OptionType,
	PopupSelect,
} from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';

import { succeedUfoExperience } from '../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../contexts/datasource-experience-id';

import { ConcatenatedMenuList } from './concatenated-menu-list';
import { columnPickerMessages } from './messages';
import { type ColumnPickerProps } from './types';

export const ColumnPicker = ({
	columns,
	selectedColumnKeys,
	onSelectedColumnKeysChange,
	onOpen,
}: ColumnPickerProps) => {
	const intl = useIntl();
	const experienceId = useDatasourceExperienceId();
	const [allOptions, setAllOptions] = useState<OptionType[]>([]);
	const pickerRef = useRef<PopupSelect<OptionType, true, ModifierList>>(null);

	const mapColumnToOption: (column: DatasourceResponseSchemaProperty) => OptionType = useCallback(
		({ key, title }) => ({ label: title, value: key }),
		[],
	);

	const selectedOptions: readonly OptionType[] = columns
		.filter(({ key }) => selectedColumnKeys.includes(key))
		.map(mapColumnToOption);

	useEffect(() => {
		setAllOptions(columns.filter(({ title }) => title).map(mapColumnToOption));
	}, [columns, mapColumnToOption]);

	const handleChange = useCallback(
		(selectedOptions: readonly OptionType[]) => {
			const selectedValues = selectedOptions.map(({ value }) => value as string);

			selectedValues.sort((a, b) => {
				const indexB = columns.findIndex(({ key }) => key === b);
				const indexA = columns.findIndex(({ key }) => key === a);
				return indexA - indexB;
			});

			onSelectedColumnKeysChange(selectedValues);
		},
		[columns, onSelectedColumnKeysChange],
	);

	const sortSelectedColumnsTop = useCallback(() => {
		if (!allOptions.length) {
			return;
		}

		const nonSelectedOptions = allOptions.filter(
			(option) => !selectedOptions.find((selectedOption) => selectedOption.value === option.value),
		);

		const sortedOptions = [...selectedOptions, ...nonSelectedOptions];

		sortedOptions.length > 0 && setAllOptions(sortedOptions);
	}, [allOptions, selectedOptions]);

	const stopEscapePropagationWhenOpen = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Escape') {
			e.stopPropagation();
		}
	};

	const handleOpen = useCallback(() => {
		onOpen && onOpen();
		void sortSelectedColumnsTop();
	}, [onOpen, sortSelectedColumnsTop]);

	// If only 1 option is selected, disable it since we don't want user to uncheck everything
	const handleIsOptionDisabled = (
		option: OptionType,
		selectValue: readonly OptionType[],
	): boolean => {
		return (
			selectValue.length === 1 &&
			selectValue.some((selectedValue) => selectedValue.value === option.value)
		);
	};

	useEffect(() => {
		if (allOptions.length) {
			// necessary to refocus the search input after the loading state
			pickerRef?.current?.selectRef?.select?.inputRef?.focus();
		}
	}, [allOptions]);

	useEffect(() => {
		if (allOptions.length) {
			if (experienceId) {
				succeedUfoExperience({ name: 'column-picker-rendered' }, experienceId);
			}
		}
	}, [allOptions, experienceId]);

	return (
		<PopupSelect
			classNamePrefix={'column-picker-popup'}
			testId={'column-picker-popup'}
			components={{ Option: CheckboxOption, MenuList: ConcatenatedMenuList }}
			filterOption={createFilter({ ignoreAccents: false })}
			options={allOptions}
			value={selectedOptions}
			onOpen={handleOpen}
			closeMenuOnSelect={false}
			hideSelectedOptions={false}
			id={'column-picker-popup'}
			isMulti
			ref={pickerRef}
			isOptionDisabled={handleIsOptionDisabled}
			placeholder={intl.formatMessage(columnPickerMessages.search)}
			onKeyDown={stopEscapePropagationWhenOpen}
			aria-label="Search for fields"
			onChange={handleChange}
			isLoading={allOptions.length === 0}
			target={({ isOpen, ...triggerProps }) => (
				<Tooltip content={intl.formatMessage(columnPickerMessages.tooltip)}>
					{(tooltipProps) => (
						<Button
							{...tooltipProps}
							{...triggerProps}
							isSelected={isOpen}
							iconBefore={
								<div>
									{/* eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19549 */}
									<BoardIcon label="board" size="medium" />
									{/* eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-19549 */}
									<ChevronDownIcon label="down" size="medium" />
								</div>
							}
							spacing="compact"
							appearance="subtle"
							testId="column-picker-trigger-button"
						/>
					)}
				</Tooltip>
			)}
		/>
	);
};
