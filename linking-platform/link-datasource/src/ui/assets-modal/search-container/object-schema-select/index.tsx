/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, styled } from '@compiled/react';
import debounce from 'debounce-promise';
import { useIntl } from 'react-intl-next';

import { Field } from '@atlaskit/form';
import { AsyncSelect } from '@atlaskit/select';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { useObjectSchemas } from '../../../../hooks/useObjectSchemas';
import {
	type ObjectSchema,
	objectSchemaKey,
	type ObjectSchemaOption,
} from '../../../../types/assets/types';

import { objectSchemaSelectMessages } from './messages';
import { objectSchemaToSelectOption } from './utils';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const FieldContainer = styled.div({
	flex: 1,
	marginTop: token('space.negative.100', '-8px'),
});

type AssetsObjectSchemaSelectProps = {
	value: ObjectSchema | undefined;
	workspaceId: string;
	initialObjectSchemas: ObjectSchema[] | undefined;
	classNamePrefix?: string;
};

export const SEARCH_DEBOUNCE_MS = 350;

const mapObjectSchemasToOptions = (objectSchemas: ObjectSchema[] | undefined) => {
	return objectSchemas
		? objectSchemas.map((objectSchema) => objectSchemaToSelectOption(objectSchema))
		: [];
};

/**
 * Rendering a `<Select>` in a `<Modal>` results in the select options getting cut off by the bottom of the modal and
 * scrolling. This is a work-around for that, see https://atlassian.slack.com/archives/CFJ9DU39U/p1623179496484100
 */
export const selectInAModalStyleFixProps = {
	styles: {
		menuPortal: (base: any) => ({ ...base, zIndex: layers.modal() }),
	},
	menuPortalTarget: document.body,
};

export const AssetsObjectSchemaSelect = ({
	value,
	workspaceId,
	initialObjectSchemas,
	classNamePrefix = 'assets-datasource-modal--object-schema-select',
}: AssetsObjectSchemaSelectProps) => {
	const { formatMessage } = useIntl();
	const { fetchObjectSchemas, objectSchemasLoading } = useObjectSchemas(workspaceId);

	const selectedObjectSchema = value ? objectSchemaToSelectOption(value) : undefined;

	const loadOptions = async (inputValue: string) => {
		const { objectSchemas } = await fetchObjectSchemas(inputValue);
		return mapObjectSchemasToOptions(objectSchemas);
	};

	const debouncedLoadOptions = debounce(loadOptions, SEARCH_DEBOUNCE_MS);

	const validateSchema = (value: ObjectSchemaOption | undefined) => {
		if (!value || !value.value) {
			return formatMessage(objectSchemaSelectMessages.schemaRequired);
		}
		return undefined;
	};

	return (
		<FieldContainer>
			<Field
				name={objectSchemaKey}
				defaultValue={selectedObjectSchema}
				validate={(value) => validateSchema(value)}
			>
				{({ fieldProps: { onChange, onFocus, ...restFieldProps } }) => (
					<AsyncSelect
						autoFocus
						classNamePrefix={classNamePrefix}
						isLoading={objectSchemasLoading}
						defaultOptions={mapObjectSchemasToOptions(initialObjectSchemas)}
						isSearchable
						loadOptions={debouncedLoadOptions}
						placeholder={formatMessage(objectSchemaSelectMessages.placeholder)}
						onChange={(newOption) => newOption && onChange(newOption)}
						{...selectInAModalStyleFixProps}
						{...restFieldProps}
						label={formatMessage(objectSchemaSelectMessages.placeholder)}
					/>
				)}
			</Field>
		</FieldContainer>
	);
};
