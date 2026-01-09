import React, { useEffect, useMemo, useState } from 'react';

import { useIntl } from 'react-intl-next';
import { useDebouncedCallback } from 'use-debounce';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { type FieldProps } from '@atlaskit/form';
import { Layering } from '@atlaskit/layering';
import { type User } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { type FilterOptionOption } from '@atlaskit/react-select';
import Select from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';

import { failUfoExperience, succeedUfoExperience } from '../../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import type { ExecuteFetch } from '../../../../state/actions';
import { SEARCH_DEBOUNCE_MS } from '../../../common/modal/popup-select/constants';
import { USER_TYPE_TEST_ID } from '../../render-type/user';
import { userTypeMessages } from '../../render-type/user/messages';
import { InlineEditUFOExperience } from '../../table-cell-content/inline-edit';
import type { DatasourceTypeWithOnlyTypeValues, DatasourceTypeWithOnlyValues } from '../../types';
import { getCleanedSelectProps } from '../../utils';

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
				menuPortalTarget={
					fg('platform_navx_sllv_j2ws_dropdown_for_single_row') ? document.body : undefined
				}
				autoFocus
				defaultMenuIsOpen
				blurInputOnSelect
				options={options}
				isLoading={isLoading}
				testId="inline-edit-user"
				filterOption={fg('navx-sllv-fix-inline-edit-error') ? filterOptionNew : filterOptionOld}
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
			/>
		</Layering>
	);
};

/**
 * Remove on navx-sllv-fix-inline-edit-error cleanup
 */
const filterOptionOld = (option: FilterOptionOption<User>, inputValue: string) =>
	option.data.displayName?.toLowerCase().includes(inputValue.toLowerCase()) ?? false;

const filterOptionNew = (option: FilterOptionOption<User>, inputValue: string) =>
	option.data?.displayName?.toLowerCase?.()?.includes(inputValue?.toLowerCase?.()) ?? false;

export default UserEditType;
