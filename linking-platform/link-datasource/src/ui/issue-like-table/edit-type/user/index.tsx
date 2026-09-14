import React, { useEffect, useMemo, useState } from 'react';

import { useIntl } from 'react-intl';
import { useDebouncedCallback } from 'use-debounce';

import Avatar from '@atlaskit/avatar/avatar';
import AvatarItem from '@atlaskit/avatar/avatar-item';
import type { FieldProps } from '@atlaskit/form/field';
import { Layering } from '@atlaskit/layering/layering';
import type { User } from '@atlaskit/linking-types/datasource';
import type { FilterOptionOption } from '@atlaskit/react-select/filters';
import Select from '@atlaskit/select/default';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { failUfoExperience } from '../../../../analytics/ufoExperiences/failUfoExperience';
import { succeedUfoExperience } from '../../../../analytics/ufoExperiences/succeedUfoExperience';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id/use-datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import type { ExecuteFetch } from '../../../../state/actions';
import { SEARCH_DEBOUNCE_MS } from '../../../common/modal/popup-select/constants';
import { getCleanedSelectProps } from '../../get-cleaned-select-props';
import { USER_TYPE_TEST_ID } from '../../render-type/user';
import { userTypeMessages } from '../../render-type/user/messages';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';

interface UserEditTypeProps extends Omit<FieldProps<string>, 'value'> {
	currentValue: DatasourceTypeWithOnlyTypeValues<'user'>;
	executeFetch?: ExecuteFetch;
	labelId?: string;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
}

const UserEditType = (props: UserEditTypeProps): React.JSX.Element => {
	const { currentValue, labelId, executeFetch } = props;
	const [fetchInputs, setFetchInputs] = useState({ query: '' });

	const [handleUserInputDebounced] = useDebouncedCallback(
		(query: string) => setFetchInputs({ query }),
		SEARCH_DEBOUNCE_MS,
	);

	const { formatMessage } = useIntl();

	const emptyUser = useMemo(
		() => ({
			accountId: null,
			displayName: formatMessage(userTypeMessages.userDefaultdisplayNameValue),
			avatarUrls: {},
		}),
		[formatMessage],
	);

	const { options, isLoading, hasFailed } = useLoadOptions<User>({
		executeFetch,
		fetchInputs,
		emptyOption: emptyUser,
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
		<Layering isDisabled={false}>
			<Select<User>
				{...getCleanedSelectProps(props)}
				menuPortalTarget={document.body}
				autoFocus
				defaultMenuIsOpen
				blurInputOnSelect
				options={options}
				isLoading={isLoading}
				testId="inline-edit-user"
				filterOption={filterOption}
				menuPlacement="auto"
				onInputChange={handleUserInputDebounced}
				value={currentValue?.values?.[0]}
				labelId={labelId}
				getOptionValue={(option) => option.atlassianUserId!}
				getOptionLabel={(option) => option.displayName || ''}
				formatOptionLabel={(option) => (
					<Tooltip content={option.displayName ?? ''}>
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
					</Tooltip>
				)}
				onChange={(e) =>
					props.setEditValues({
						type: 'user',
						values: e ? [e] : [],
					})
				}
				shouldPreventEscapePropagation
			/>
		</Layering>
	);
};

const filterOption = (option: FilterOptionOption<User>, inputValue: string) =>
	option.data?.displayName?.toLowerCase?.()?.includes(inputValue?.toLowerCase?.()) ?? false;

export default UserEditType;
