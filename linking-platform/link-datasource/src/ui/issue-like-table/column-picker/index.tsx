import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl';
import { mergeRefs } from 'use-callback-ref';

import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import CustomizeIcon from '@atlaskit/icon/core/customize';
import TableColumnsDistributeIcon from '@atlaskit/icon/core/table-columns-distribute';
import type { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types/datasource';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled';
import { createFilter } from '@atlaskit/react-select/filters';
import { type ModifierList, PopupSelect } from '@atlaskit/select/popup-select';
import type { OptionType } from '@atlaskit/select/types';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { succeedUfoExperience } from '../../../analytics/ufoExperiences/succeedUfoExperience';
import { useDatasourceExperienceId } from '../../../contexts/datasource-experience-id/use-datasource-experience-id';
import { ConcatenatedMenuList } from './concatenated-menu-list';
import { MenuItem } from './menu-item';
import { columnPickerMessages } from './messages';
import { type ColumnPickerProps } from './types';

const styles = cssMap({
	customizeIcon: {
		verticalAlign: 'middle',
	},
});

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
				if (fg('platform_lp_sllv_table_settings_menu')) {
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
				}

				return (
					<Tooltip content={intl.formatMessage(columnPickerMessages.tooltip)}>
						{(tooltipProps) => (
							<Button
								{...tooltipProps}
								{...triggerProps}
								// `tooltipProps.ref` must be included: spreading `triggerProps` after
								// `tooltipProps` drops the tooltip's ref, leaving Tooltip without an
								// anchor element. Gate off leaves `triggerProps.ref` winning, exactly as
								// master does.
								ref={
									fg('platform-dst-top-layer-tooltip')
										? mergeRefs([triggerProps.ref, tooltipProps.ref])
										: triggerProps.ref
								}
								isSelected={isOpen}
								spacing="compact"
								appearance={'default'}
								testId="column-picker-trigger-button"
								iconAfter={() => <ChevronDownIcon label="down" size="small" />}
							>
								<Box as="span" xcss={styles.customizeIcon}>
									<CustomizeIcon label="customize" />
								</Box>
							</Button>
						)}
					</Tooltip>
				);
			}}
		/>
	);
};
