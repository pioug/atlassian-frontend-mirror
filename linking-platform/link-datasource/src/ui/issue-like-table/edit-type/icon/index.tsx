import React, { useEffect } from 'react';

import { type FieldProps } from '@atlaskit/form';
import { Layering } from '@atlaskit/layering';
import { type Icon } from '@atlaskit/linking-types';
// FilterOptionOption is used in the filterOption function which is part of the public API, but the type itself is not exported
// eslint-disable-next-line import/no-extraneous-dependencies,no-restricted-imports
import { type FilterOptionOption } from '@atlaskit/react-select/src/filters';
import Select from '@atlaskit/select';

import { failUfoExperience, succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import { type ExecuteFetch } from '../../../../state/actions';
import { SharedIconComponent } from '../../shared-components/icon';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';

interface IconEditTypeProps extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'icon'>;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
	executeFetch?: ExecuteFetch;
}

/**
 * Should be gated by FF rollout of platform-datasources-enable-two-way-sync-priority
 */
const IconEditType = (props: IconEditTypeProps) => {
	const { currentValue, executeFetch } = props;
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
				{...props}
				autoFocus
				blurInputOnSelect
				defaultMenuIsOpen
				options={options}
				menuPlacement="auto"
				isLoading={isLoading}
				filterOption={filterOption}
				testId="inline-edit-priority"
				defaultValue={currentValue?.values?.[0]}
				getOptionValue={(option) => option.text || ''}
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
		</Layering>
	);
};

const filterOption = (option: FilterOptionOption<Icon>, inputValue: string) =>
	option.label.toLowerCase().includes(inputValue.toLowerCase());

export default IconEditType;
