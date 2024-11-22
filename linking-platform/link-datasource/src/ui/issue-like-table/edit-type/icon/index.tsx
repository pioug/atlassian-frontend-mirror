import React, { useEffect, useState } from 'react';

import { type FieldProps } from '@atlaskit/form';
import {
	ActionOperationStatus,
	type AtomicActionExecuteResponse,
	type Icon,
} from '@atlaskit/linking-types';
// FilterOptionOption is used in the filterOption function which is part of the public API, but the type itself is not exported
// eslint-disable-next-line import/no-extraneous-dependencies,no-restricted-imports
import { type FilterOptionOption } from '@atlaskit/react-select/src/filters';
import Select from '@atlaskit/select';

import { failUfoExperience, succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useDatasourceTableFlag } from '../../../../hooks/useDatasourceTableFlag';
import { type ExecuteFetch } from '../../../../state/actions';
import { SharedIconComponent } from '../../shared-components/icon';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';

interface Props extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'icon'>;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
	executeFetch?: ExecuteFetch;
}

/**
 * Should be gated by FF rollout of platform-datasources-enable-two-way-sync-priority
 */
const IconEditType = (props: Props) => {
	const { currentValue, executeFetch } = props;
	const { options, isLoading, hasFailed } = usePriorityOptions(currentValue, executeFetch);
	const experienceId = useDatasourceExperienceId();

	useEffect(() => {
		if (!experienceId) {
			return;
		}

		if (hasFailed) {
			failUfoExperience(
				{
					name: InlineEditUFOExperience,
				},
				experienceId,
			);
		} else if (!isLoading) {
			succeedUfoExperience(
				{
					name: InlineEditUFOExperience,
				},
				experienceId,
			);
		}
	}, [experienceId, isLoading, hasFailed]);

	return (
		<div>
			<Select<Icon>
				{...props}
				testId="inline-edit-priority"
				autoFocus
				defaultMenuIsOpen
				blurInputOnSelect
				getOptionValue={(option) => option.text || ''}
				options={options}
				isLoading={isLoading}
				defaultValue={currentValue?.values?.[0]}
				filterOption={filterOption}
				formatOptionLabel={({ source, label, text }) => (
					<SharedIconComponent
						iconUrl={source}
						text={text}
						label={label}
						testId={`inline-edit-priority-option-${label}`}
					/>
				)}
				onChange={(e) =>
					props.setEditValues({
						type: 'icon',
						values: e ? [e] : [],
					})
				}
			/>
		</div>
	);
};

const filterOption = (option: FilterOptionOption<Icon>, inputValue: string) =>
	option.label.toLowerCase().includes(inputValue.toLowerCase());

const usePriorityOptions = (
	currentValue: DatasourceTypeWithOnlyTypeValues<'icon'>,
	executeFetch?: ExecuteFetch,
) => {
	const [{ options, isLoading, hasFailed }, setOptions] = useState<{
		isLoading: boolean;
		options: Icon[];
		hasFailed: boolean;
	}>({
		isLoading: true,
		options: [],
		hasFailed: false,
	});

	const { showErrorFlag } = useDatasourceTableFlag({ isFetchAction: true });
	useEffect(() => {
		let isMounted = true;
		loadOptions(currentValue, executeFetch)
			.then((options) => {
				if (isMounted) {
					setOptions({ isLoading: false, options, hasFailed: false });
				}
			})
			.catch((err) => {
				showErrorFlag();
				setOptions({ isLoading: false, options: [], hasFailed: true });
			});
		return () => {
			isMounted = false;
		};
	}, [currentValue, executeFetch, showErrorFlag]);

	return { options, isLoading, hasFailed };
};

/**
 * Load options for the select
 */
const loadOptions = async (
	_currentValue: DatasourceTypeWithOnlyTypeValues<'icon'>,
	executeFetch?: ExecuteFetch,
): Promise<Icon[]> => {
	if (!executeFetch) {
		return [];
	}

	const { operationStatus, entities } = await executeFetch<AtomicActionExecuteResponse<Icon>>({});

	if (operationStatus === ActionOperationStatus.FAILURE) {
		throw new Error('Failed to fetch icon options');
	}

	if (operationStatus === ActionOperationStatus.SUCCESS && entities) {
		// Map entities here if the backend type is different from the type required by the select
		return entities;
	}
	return [];
};

export default IconEditType;
