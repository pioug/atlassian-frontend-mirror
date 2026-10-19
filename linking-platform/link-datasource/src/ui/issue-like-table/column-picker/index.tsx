import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import IconButton from '@atlaskit/button/icon/button';
import TableColumnsDistributeIcon from '@atlaskit/icon/core/table-columns-distribute';
import type { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types/datasource';
import { createFilter } from '@atlaskit/react-select/filters';
import { type ModifierList, PopupSelect } from '@atlaskit/select/popup-select';
import type { OptionType } from '@atlaskit/select/types';

import { succeedUfoExperience } from '../../../analytics/ufoExperiences/succeedUfoExperience';
import { useDatasourceExperienceId } from '../../../contexts/datasource-experience-id/use-datasource-experience-id';
import { ConcatenatedMenuList } from './concatenated-menu-list';
import { MenuItem } from './menu-item';
import { columnPickerMessages } from './messages';
import { type ColumnPickerProps } from './types';

export const ColumnPicker = ({
	columns,
	selectedColumnKeys,
	onSelectedColumnKeysChange,
	onOpen,
}: ColumnPickerProps): React.JSX.Element => {
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
		if (pickerRef?.current && allOptions.length > 0) {
			// necessary to refocus the search input after the loading state
			pickerRef?.current?.selectRef?.select?.inputRef?.focus();
		}
	}, [allOptions.length]);

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
			components={{ Option: MenuItem, MenuList: ConcatenatedMenuList }}
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
			label="Search for fields"
			onChange={handleChange}
			isLoading={allOptions.length === 0}
			target={({ isOpen, ...triggerProps }) => {
				return (
					<IconButton
						{...triggerProps}
						appearance="default"
						icon={TableColumnsDistributeIcon}
						isSelected={isOpen}
						isTooltipDisabled={false}
						label={intl.formatMessage(columnPickerMessages.tooltip)}
						spacing="default"
						testId="column-picker-trigger-button"
					/>
				);
			}}
		/>
	);
};
