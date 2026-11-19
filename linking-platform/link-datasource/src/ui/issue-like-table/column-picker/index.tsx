import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import IconButton from '@atlaskit/button/icon/button';
import TableColumnsDistributeIcon from '@atlaskit/icon/core/table-columns-distribute';
import type { DatasourceResponseSchemaProperty } from '@atlaskit/linking-types/datasource';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/extract-closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { createFilter } from '@atlaskit/react-select/filters';
import { type ModifierList, PopupSelect } from '@atlaskit/select/popup-select';
import type { OptionType } from '@atlaskit/select/types';

import { succeedUfoExperience } from '../../../analytics/ufoExperiences/succeedUfoExperience';
import { useDatasourceExperienceId } from '../../../contexts/datasource-experience-id/use-datasource-experience-id';
import { ColumnPickerInstanceContext } from './column-picker-instance';
import {
	ConcatenatedMenuList,
	ConcatenatedMenuListWithSelectedSeparator,
} from './concatenated-menu-list';
import { isColumnPickerDragDataFor } from './drag-data';
import { MenuItem } from './menu-item';
import { columnPickerMessages } from './messages';
import { ReorderableMenuItem } from './reorderable-menu-item';
import { type ColumnPickerProps } from './types';

const sortOptionsByLabel = (options: OptionType[]): OptionType[] =>
	[...options].sort((a, b) => a.label.localeCompare(b.label));

export const ColumnPicker = ({
	columns,
	selectedColumnKeys,
	onSelectedColumnKeysChange,
	onOpen,
	isColumnReorderEnabled = false,
}: ColumnPickerProps): React.JSX.Element => {
	const intl = useIntl();
	const shouldShowReorderUI =
		isColumnReorderEnabled && fg('astral_assets_macro_table_ui_coloumn_reorder');
	const experienceId = useDatasourceExperienceId();
	const [allOptions, setAllOptions] = useState<OptionType[]>([]);
	const pickerRef = useRef<PopupSelect<OptionType, true, ModifierList>>(null);
	const [pickerId] = useState(() => Symbol('column-picker'));

	const mapColumnToOption: (column: DatasourceResponseSchemaProperty) => OptionType = useCallback(
		({ key, title }) => ({ label: title, value: key }),
		[],
	);

	// With reordering, the user's order of selected columns is preserved instead of the schema order
	const selectedOptions: readonly OptionType[] = shouldShowReorderUI
		? selectedColumnKeys
				.map((selectedKey) => columns.find(({ key }) => key === selectedKey))
				.filter((column): column is DatasourceResponseSchemaProperty => !!column)
				.map(mapColumnToOption)
		: columns.filter(({ key }) => selectedColumnKeys.includes(key)).map(mapColumnToOption);

	useEffect(() => {
		setAllOptions(columns.filter(({ title }) => title).map(mapColumnToOption));
	}, [columns, mapColumnToOption]);

	const moveSelectedOptionsToTop = useCallback((orderedSelectedValues: string[]) => {
		setAllOptions((options) => [
			...orderedSelectedValues.flatMap((selectedValue) =>
				options.filter(({ value }) => value === selectedValue),
			),
			...options.filter(({ value }) => !orderedSelectedValues.includes(value as string)),
		]);
	}, []);

	const handleChange = useCallback(
		(selectedOptions: readonly OptionType[]) => {
			const selectedValues = selectedOptions.map(({ value }) => value as string);

			if (shouldShowReorderUI) {
				moveSelectedOptionsToTop(selectedValues);
				onSelectedColumnKeysChange(selectedValues);
				return;
			}

			selectedValues.sort((a, b) => {
				const indexB = columns.findIndex(({ key }) => key === b);
				const indexA = columns.findIndex(({ key }) => key === a);
				return indexA - indexB;
			});

			onSelectedColumnKeysChange(selectedValues);
		},
		[columns, onSelectedColumnKeysChange, shouldShowReorderUI, moveSelectedOptionsToTop],
	);

	useEffect(() => {
		if (!shouldShowReorderUI) {
			return;
		}

		return monitorForElements({
			canMonitor: ({ source }) => isColumnPickerDragDataFor(source.data, pickerId),
			onDrop: ({ source, location }) => {
				const target = location.current.dropTargets[0];
				if (!target || !isColumnPickerDragDataFor(target.data, pickerId)) {
					return;
				}

				const sourceKey = source.data.value as string;
				if (!selectedColumnKeys.includes(sourceKey)) {
					return;
				}

				if (target.data.zone === 'unselected') {
					// Same rule as handleIsOptionDisabled: at least one column must stay selected
					if (selectedColumnKeys.length <= 1) {
						return;
					}
					const nextSelectedKeys = selectedColumnKeys.filter((key) => key !== sourceKey);
					moveSelectedOptionsToTop(nextSelectedKeys);
					onSelectedColumnKeysChange(nextSelectedKeys);
					return;
				}

				const startIndex = selectedColumnKeys.indexOf(sourceKey);
				const indexOfTarget = selectedColumnKeys.indexOf(target.data.value as string);
				if (startIndex === -1 || indexOfTarget === -1 || startIndex === indexOfTarget) {
					return;
				}

				const nextSelectedKeys = reorderWithEdge({
					list: selectedColumnKeys,
					startIndex,
					indexOfTarget,
					closestEdgeOfTarget: extractClosestEdge(target.data),
					axis: 'vertical',
				});
				moveSelectedOptionsToTop(nextSelectedKeys);
				onSelectedColumnKeysChange(nextSelectedKeys);
			},
		});
	}, [
		shouldShowReorderUI,
		pickerId,
		selectedColumnKeys,
		onSelectedColumnKeysChange,
		moveSelectedOptionsToTop,
	]);

	const sortSelectedColumnsTop = useCallback(() => {
		if (!allOptions.length) {
			return;
		}

		const nonSelectedOptions = allOptions.filter(
			(option) => !selectedOptions.find((selectedOption) => selectedOption.value === option.value),
		);

		const sortedOptions = shouldShowReorderUI
			? [...selectedOptions, ...sortOptionsByLabel(nonSelectedOptions)]
			: [...selectedOptions, ...nonSelectedOptions];

		sortedOptions.length > 0 && setAllOptions(sortedOptions);
	}, [allOptions, selectedOptions, shouldShowReorderUI]);

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
		<ColumnPickerInstanceContext.Provider value={pickerId}>
			<PopupSelect
				classNamePrefix={'column-picker-popup'}
				testId={'column-picker-popup'}
				components={
					shouldShowReorderUI
						? { Option: ReorderableMenuItem, MenuList: ConcatenatedMenuListWithSelectedSeparator }
						: { Option: MenuItem, MenuList: ConcatenatedMenuList }
				}
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
		</ColumnPickerInstanceContext.Provider>
	);
};
