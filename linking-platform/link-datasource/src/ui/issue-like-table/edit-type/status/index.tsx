import React, { useEffect } from 'react';

import type { FieldProps } from '@atlaskit/form/field';
import { Layering } from '@atlaskit/layering/layering';
import type { Status } from '@atlaskit/linking-types/datasource';
import Lozenge from '@atlaskit/lozenge/lozenge';
import type { FilterOptionOption } from '@atlaskit/react-select/filters';
import Select from '@atlaskit/select/default';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { failUfoExperience } from '../../../../analytics/ufoExperiences/failUfoExperience';
import { succeedUfoExperience } from '../../../../analytics/ufoExperiences/succeedUfoExperience';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id/use-datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import type { ExecuteFetch } from '../../../../state/actions';
import { getCleanedSelectProps } from '../../get-cleaned-select-props';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';

interface StatusEditTypeProps extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'status'>;
	executeFetch?: ExecuteFetch;
	labelId?: string;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
}

const StatusEditType = (props: StatusEditTypeProps): React.JSX.Element => {
	const { currentValue, labelId, executeFetch } = props;
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
		<Layering isDisabled={false}>
			<Select<Status>
				{...getCleanedSelectProps(props)}
				menuPortalTarget={document.body}
				autoFocus
				options={options}
				defaultMenuIsOpen
				blurInputOnSelect
				menuPlacement="auto"
				isLoading={isLoading}
				filterOption={filterOption}
				testId="inline-edit-status"
				getOptionValue={(option) => option.text}
				value={currentValue?.values?.[0]}
				labelId={labelId}
				formatOptionLabel={(option) => (
					<Tooltip content={option.text}>
						<Lozenge
							testId={`inline-edit-status-option-${option.text}`}
							{...option.style}
							isBold={option.style?.isBold !== false}
						>
							{option.text}
						</Lozenge>
					</Tooltip>
				)}
				getOptionLabel={(option) => option.text}
				onChange={(e) =>
					props.setEditValues({
						type: 'status',
						values: e ? [e] : [],
					})
				}
				shouldPreventEscapePropagation
			/>
		</Layering>
	);
};

const filterOption = (option: FilterOptionOption<Status>, inputValue: string) =>
	option.data?.text?.toLowerCase?.()?.includes(inputValue?.toLowerCase?.());

export default StatusEditType;
