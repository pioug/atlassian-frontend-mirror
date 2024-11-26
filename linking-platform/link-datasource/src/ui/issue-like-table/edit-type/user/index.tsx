import React, { useEffect, useState } from 'react';

import { useDebouncedCallback } from 'use-debounce';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { type FieldProps } from '@atlaskit/form';
import { type User } from '@atlaskit/linking-types';
import Select from '@atlaskit/select';

import { failUfoExperience, succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import type { ExecuteFetch } from '../../../../state/actions';
import { SEARCH_DEBOUNCE_MS } from '../../../common/modal/popup-select/constants';
import { USER_TYPE_TEST_ID } from '../../render-type/user';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';

interface UserEditTypeProps extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'user'>;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
	executeFetch?: ExecuteFetch;
}

const UserEditType = (props: UserEditTypeProps) => {
	const { currentValue, executeFetch } = props;
	const [fetchInputs, setFetchInputs] = useState({ query: '' });

	const [handleUserInputDebounced] = useDebouncedCallback(
		(query: string) => setFetchInputs({ query }),
		SEARCH_DEBOUNCE_MS,
	);

	const { options, isLoading, hasFailed } = useLoadOptions<User>({
		executeFetch,
		fetchInputs,
	});

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
		<Select<User>
			{...props}
			autoFocus
			defaultMenuIsOpen
			blurInputOnSelect
			options={options}
			isLoading={isLoading}
			testId="inline-edit-user"
			filterOption={() => true} // necessary, otherwise by default all options will be filtered out on user input
			onInputChange={handleUserInputDebounced}
			defaultValue={currentValue?.values?.[0]}
			getOptionValue={(option) => option.atlassianUserId!}
			formatOptionLabel={(option) => (
				<AvatarItem
					avatar={
						<Avatar
							appearance="circle"
							size={'small'}
							src={option.avatarSource}
							testId={`${USER_TYPE_TEST_ID}--avatar--${option.atlassianUserId}`}
						/>
					}
					primaryText={option.displayName}
				/>
			)}
			onChange={(e) =>
				props.setEditValues({
					type: 'user',
					values: e ? [e] : [],
				})
			}
		/>
	);
};

export default UserEditType;
