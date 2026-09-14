import type { FormEvent } from 'react';

import type { FieldProps } from '@atlaskit/form/field';

/**
 * Remove deprecated `aria-labelledby` prop from select component props.
 */
export const getCleanedSelectProps = (
	props: Omit<FieldProps<string>, 'value'>,
): {
	'aria-describedby'?: string | undefined;
	'aria-invalid': 'true' | 'false';
	id: string;
	isDisabled: boolean;
	isInvalid: boolean;
	isRequired: boolean;
	name: string;
	onBlur: () => void;
	onChange: (value: string | FormEvent<HTMLInputElement>) => void;
	onFocus: () => void;
} => {
	// Component Field auto adds `aria-labelledby` prop, which is deprecated and should not be used - https://hello.jira.atlassian.cloud/browse/ENGHEALTH-14529
	const { 'aria-labelledby': removedLabelByProps, ...selectProps } = props;
	return selectProps;
};
