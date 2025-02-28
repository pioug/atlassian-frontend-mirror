import React, { type PropsWithChildren } from 'react';

import { useIntl } from 'react-intl-next';

import { Inline } from '@atlaskit/primitives/compiled';
import AkSelect, {
	components,
	type OptionProps,
	type OptionType,
	type SingleValueProps,
} from '@atlaskit/select';
import { layers } from '@atlaskit/theme/constants';

import { UrlIcon } from '../../../common/ui/icon';
import { CreateField } from '../../../controllers/create-field';

import { messages } from './messages';
import { type SelectProps, type SitePickerOptionType } from './types';

export const TEST_ID = 'link-create-select';

/**
 * A select component utilising the Atlaskit Select and CreateField.
 * Validation is handled by the form on form submission. Any
 * errors returned by the handleSubmit function passed to the form <Form> that
 * have a key matching the `name` of this field are shown below the field.
 */
export function Select<T = OptionType>({
	id,
	name,
	label,
	isRequired,
	validators,
	validationHelpText,
	testId = TEST_ID,
	...restProps
}: SelectProps<T>): JSX.Element {
	return (
		<CreateField
			id={id}
			name={name}
			label={label}
			isRequired={isRequired}
			validators={validators}
			validationHelpText={validationHelpText}
			testId={testId}
		>
			{({ fieldId, isRequired, ...fieldProps }) => {
				return <AkSelect required={isRequired} inputId={fieldId} {...fieldProps} {...restProps} />;
			}}
		</CreateField>
	);
}

export type SiteSelectProps = {
	testId?: string;
	options?: SitePickerOptionType[];
	name?: string;
};

export const SiteSelect = ({ options, name, testId }: SiteSelectProps): JSX.Element => {
	const intl = useIntl();
	const siteTestId = testId ? testId : 'link-create-site-picker';
	return (
		<Select<SitePickerOptionType>
			isRequired
			isSearchable
			name={name ?? 'site'}
			options={options}
			label={intl.formatMessage(messages.siteLabel)}
			components={{
				Option: SitePickerOption,
				SingleValue: SitePickerSingleValue,
			}}
			testId={siteTestId}
			styles={{
				menuPortal: (base) => ({ ...base, zIndex: layers.modal() }),
				option: (base) => ({
					...base,
					display: 'flex',
					alignItems: 'center',
					cursor: 'pointer',
				}),
			}}
		/>
	);
};

const SiteRow = ({ avatarUrl, children }: PropsWithChildren<{ avatarUrl?: string }>) => (
	<Inline space="space.100" alignBlock="center">
		{avatarUrl ? <UrlIcon url={avatarUrl} /> : null}
		{children}
	</Inline>
);

export const SitePickerOption = ({
	children,
	...props
}: PropsWithChildren<OptionProps<SitePickerOptionType, false>>): JSX.Element => (
	<components.Option {...props}>
		<SiteRow avatarUrl={props.data.value.avatarUrl}>{children}</SiteRow>
	</components.Option>
);

export const SitePickerSingleValue = ({
	children,
	...props
}: PropsWithChildren<SingleValueProps<SitePickerOptionType, false>>): JSX.Element => (
	<components.SingleValue {...props}>
		<SiteRow avatarUrl={props.data.value.avatarUrl}>{children}</SiteRow>
	</components.SingleValue>
);
