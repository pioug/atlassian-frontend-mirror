import React, { useEffect } from 'react';

import { type FieldProps } from '@atlaskit/form';
import { type Status } from '@atlaskit/linking-types';
import Lozenge from '@atlaskit/lozenge';
import { type FilterOptionOption } from '@atlaskit/react-select';
import Select from '@atlaskit/select';

import { failUfoExperience, succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import type { ExecuteFetch } from '../../../../state/actions';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';

interface StatusEditTypeProps extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'status'>;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
	executeFetch?: ExecuteFetch;
}

const StatusEditType = (props: StatusEditTypeProps) => {
	const { currentValue, executeFetch } = props;
	const { options, isLoading, hasFailed } = useLoadOptions<Status>({ executeFetch });
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
			autoFocus
			options={options}
			defaultMenuIsOpen
			blurInputOnSelect
			menuPlacement="auto"
			isLoading={isLoading}
			filterOption={filterOption}
			testId="inline-edit-status"
			getOptionValue={(option) => option.text}
			defaultValue={currentValue?.values?.[0]}
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

export default StatusEditType;
