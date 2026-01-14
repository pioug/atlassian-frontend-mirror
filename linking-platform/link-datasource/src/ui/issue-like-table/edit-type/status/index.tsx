import React, { useEffect } from 'react';

import { type FieldProps } from '@atlaskit/form';
import { Layering } from '@atlaskit/layering';
import { type Status } from '@atlaskit/linking-types';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { type FilterOptionOption } from '@atlaskit/react-select';
import Select from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';

import { failUfoExperience, succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import type { ExecuteFetch } from '../../../../state/actions';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';
import { getCleanedSelectProps } from '../../utils';

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
				menuPortalTarget={
					fg('platform_navx_sllv_j2ws_dropdown_for_single_row') ? document.body : undefined
				}
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
							isBold={
								fg('platform-component-visual-refresh')
									? option.style?.isBold !== false
									: option.style?.isBold
							}
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
				shouldPreventEscapePropagation={
					fg('platform_navx_sllv_dropdown_escape_and_focus_fix') ? true : undefined
				}
			/>
		</Layering>
	);
};

const filterOption = (option: FilterOptionOption<Status>, inputValue: string) =>
	option.data?.text?.toLowerCase?.()?.includes(inputValue?.toLowerCase?.());

export default StatusEditType;
