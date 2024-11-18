import React, { useEffect, useState } from 'react';

import { type FieldProps } from '@atlaskit/form';
import {
	ActionOperationStatus,
	type AtomicActionExecuteRequest,
	type AtomicActionExecuteResponse,
	type Status,
} from '@atlaskit/linking-types';
import Lozenge from '@atlaskit/lozenge';
import { type FilterOptionOption } from '@atlaskit/react-select';
import Select from '@atlaskit/select';

import { failUfoExperience, succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import type { ExecuteFetch } from '../../../../state/actions';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyValues } from '../../types';

interface Props extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyValues;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
	executeFetch?: ExecuteFetch;
}

const StatusEditType = (props: Props) => {
	const { currentValue, executeFetch } = props;
	const { options, isLoading, hasFailed } = useStatusOptions({ executeFetch });
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
		<Select<Status>
			{...props}
			testId="inline-edit-status"
			autoFocus
			defaultMenuIsOpen
			blurInputOnSelect
			getOptionValue={(option) => option.text}
			options={options}
			isLoading={isLoading}
			defaultValue={currentValue?.values?.[0] as Status}
			filterOption={filterOption}
			menuPlacement="auto"
			formatOptionLabel={(option) => (
				<Lozenge testId={`inline-edit-status-option-${option.text}`} {...option.style}>
					{option.text}
				</Lozenge>
			)}
			onChange={(e) =>
				props.setEditValues({
					type: 'status',
					values: e ? [e] : [],
				})
			}
		/>
	);
};

const filterOption = (option: FilterOptionOption<Status>, inputValue: string) =>
	option.data.text.toLowerCase().includes(inputValue.toLowerCase());

const useStatusOptions = ({
	fetchInputs,
	executeFetch,
}: {
	fetchInputs?: AtomicActionExecuteRequest['parameters']['inputs'];
	executeFetch?: ExecuteFetch;
}) => {
	const [{ options, isLoading, hasFailed }, setOptions] = useState({
		isLoading: true,
		options: [] as Status[],
		hasFailed: false,
	});

	useEffect(() => {
		let isMounted = true;
		loadOptions(fetchInputs, executeFetch)
			.then((options) => {
				if (isMounted) {
					setOptions({ isLoading: false, options, hasFailed: false });
				}
			})
			.catch((err) => {
				setOptions({ isLoading: false, options: [], hasFailed: true });
			});
		return () => {
			isMounted = false;
		};
	}, [fetchInputs, executeFetch]);

	return { options, isLoading, hasFailed };
};

const loadOptions = async (
	fetchInputs: AtomicActionExecuteRequest['parameters']['inputs'] = {},
	executeFetch?: ExecuteFetch,
): Promise<Status[]> => {
	if (executeFetch) {
		const result = await executeFetch<AtomicActionExecuteResponse<Status>>(fetchInputs);

		const { operationStatus, entities } = result;

		if (operationStatus === ActionOperationStatus.FAILURE) {
			throw new Error('Failed to fetch status options');
		}

		if (entities) {
			return entities.map((entity) => ({
				id: entity.id,
				text: entity.text,
				style: entity.style,
				transitionId: entity.transitionId,
			}));
		}
	}

	return [];
};

export default StatusEditType;
