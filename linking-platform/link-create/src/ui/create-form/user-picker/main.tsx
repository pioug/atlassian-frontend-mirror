/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import SmartUserPicker from '@atlaskit/smart-user-picker';

import { CreateField } from '../../../controllers/create-field';

import { type UserPickerProps } from './types';

export const TEST_ID = 'link-create-user-picker';
const DEFAULT_DEBOUNCE_TIME = 400;
const UserPickerWidth = '100%';

/**
 * A user picker utilising the SmartUserPicker.
 */

export function UserPicker({
	productKey,
	siteId,
	name,
	label,
	placeholder,
	validators,
	testId = TEST_ID,
	defaultValue,
}: UserPickerProps) {
	return (
		<CreateField name={name} label={label} isRequired testId={testId} validators={validators}>
			{({ fieldId, ...fieldProps }) => {
				return (
					<SmartUserPicker
						defaultValue={defaultValue}
						placeholder={placeholder}
						onChange={(value) => fieldProps.onChange(value)}
						subtle
						isMulti={false}
						productKey={productKey}
						siteId={siteId}
						fieldId={fieldId}
						debounceTime={DEFAULT_DEBOUNCE_TIME}
						prefetch
						isClearable={false}
						width={UserPickerWidth}
					/>
				);
			}}
		</CreateField>
	);
}
