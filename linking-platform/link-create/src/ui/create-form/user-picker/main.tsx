import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import SmartUserPicker from '@atlaskit/smart-user-picker';

import { CreateField } from '../../../controllers/create-field';

import { UserPickerOld } from './old/main';
import { type UserPickerProps } from './types';

export const TEST_ID = 'link-create-user-picker';
const DEFAULT_DEBOUNCE_TIME = 400;
const UserPickerWidth = '100%';

/**
 * A user picker utilising the SmartUserPicker.
 */
const UserPickerNew = ({
	productKey,
	siteId,
	name,
	label,
	placeholder,
	validators,
	testId = TEST_ID,
	defaultValue,
}: UserPickerProps): JSX.Element => {
	return (
		<CreateField name={name} label={label} isRequired testId={testId} validators={validators}>
			{({ fieldId, isRequired, ...fieldProps }) => {
				return (
					<SmartUserPicker
						defaultValue={defaultValue ? { ...defaultValue, type: 'user' } : undefined}
						placeholder={placeholder}
						onChange={(value) => fieldProps.onChange(value)}
						subtle
						isMulti={false}
						productKey={productKey}
						siteId={siteId}
						fieldId={fieldId}
						inputId={fieldId}
						debounceTime={DEFAULT_DEBOUNCE_TIME}
						prefetch
						isClearable={false}
						width={UserPickerWidth}
						required={isRequired}
					/>
				);
			}}
		</CreateField>
	);
};

export const UserPicker = (props: UserPickerProps) => {
	if (fg('platform_bandicoots-link-create-css')) {
		return <UserPickerNew {...props} />;
	}
	return <UserPickerOld {...props} />;
};
