import React, { useEffect } from 'react';

import { type FieldProps } from '@atlaskit/form';
import { Layering } from '@atlaskit/layering';
import { type Icon } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { type FilterOptionOption } from '@atlaskit/react-select';
import Select from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';

import { failUfoExperience, succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import { type ExecuteFetch } from '../../../../state/actions';
import { SharedIconComponent } from '../../shared-components/icon';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';
import { getCleanedSelectProps } from '../../utils';

interface IconEditTypeProps extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'icon'>;
	executeFetch?: ExecuteFetch;
	labelId?: string;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
}

const IconEditType = (props: IconEditTypeProps): React.JSX.Element => {
	const { currentValue, labelId, executeFetch } = props;
	const { options, isLoading, hasFailed } = useLoadOptions<Icon>({ executeFetch });
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
			<Select<Icon>
				{...getCleanedSelectProps(props)}
				autoFocus
				blurInputOnSelect
				defaultMenuIsOpen
				// We can't update this field if we don't have an ID - however the ID
				// is typed optional.
				options={
					fg('navx-sllv-fix-inline-edit-error')
						? options?.filter((option) => option.id)
						: options.filter((option) => option.id)
				}
				menuPlacement="auto"
				isLoading={isLoading}
				filterOption={fg('navx-sllv-fix-inline-edit-error') ? filterOptionNew : filterOptionOld}
				testId="inline-edit-priority"
				value={currentValue?.values?.[0]}
				labelId={labelId}
				getOptionValue={(option) => option.text || ''}
				formatOptionLabel={({ source, label, text }) => (
					<Tooltip content={text ?? ''}>
						<SharedIconComponent
							iconUrl={source}
							text={text}
							label={label}
							testId={`inline-edit-priority-option-${label}`}
						/>
					</Tooltip>
				)}
				onChange={(e) =>
					props.setEditValues({
						type: 'icon',
						values: e ? [e] : [],
					})
				}
			/>
		</Layering>
	);
};

/**
 * Remove on navx-sllv-fix-inline-edit-error cleanup
 */
const filterOptionOld = (option: FilterOptionOption<Icon>, inputValue: string) =>
	option.label.toLowerCase().includes(inputValue.toLowerCase());

const filterOptionNew = (option: FilterOptionOption<Icon>, inputValue: string) =>
	option.label?.toLowerCase?.()?.includes(inputValue?.toLowerCase());

export default IconEditType;
