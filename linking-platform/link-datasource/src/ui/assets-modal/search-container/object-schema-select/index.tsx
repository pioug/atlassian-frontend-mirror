/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useRef, useState } from 'react';

import { jsx, styled } from '@compiled/react';
import debounce from 'debounce-promise';
import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { Field } from '@atlaskit/form';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { type InputActionMeta, PopupSelect } from '@atlaskit/select';
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
	classNamePrefix?: string;
	initialObjectSchemas: ObjectSchema[] | undefined;
	testId?: string;
	value: ObjectSchema | undefined;
	workspaceId: string;
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
export const selectInAModalStyleFixProps: {
	menuPortalTarget: HTMLElement;
	styles: {
		menuPortal: (base: any) => any;
	};
} = {
	styles: {
		menuPortal: (base: any): any => ({ ...base, zIndex: layers.modal() }),
	},
	menuPortalTarget: document.body,
};

export const AssetsObjectSchemaSelect = ({
	value,
	workspaceId,
	initialObjectSchemas,
	classNamePrefix: _classNamePrefix = 'assets-datasource-modal--object-schema-select',
	testId = 'assets-datasource-modal--object-schema-select',
}: AssetsObjectSchemaSelectProps) => {
	const { formatMessage } = useIntl();
	const { fetchObjectSchemas, objectSchemasLoading } = useObjectSchemas(workspaceId);
	const [searchTerm, setSearchTerm] = useState('');
	const [options, setOptions] = useState<ObjectSchemaOption[]>(
		mapObjectSchemasToOptions(initialObjectSchemas),
	);

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

	const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleInputChange = useCallback(
		async (newSearchTerm: string, actionMeta: InputActionMeta) => {
			if (actionMeta.action === 'input-change' && newSearchTerm !== searchTerm) {
				setSearchTerm(newSearchTerm);

				if (debounceTimeout.current) {
					clearTimeout(debounceTimeout.current);
				}

				debounceTimeout.current = setTimeout(async () => {
					setOptions(await debouncedLoadOptions(newSearchTerm));
				}, SEARCH_DEBOUNCE_MS);
			}
		},
		[debouncedLoadOptions, searchTerm],
	);

	const onClose = useCallback(() => {
		setSearchTerm('');
		setOptions(mapObjectSchemasToOptions(initialObjectSchemas));
	}, [initialObjectSchemas]);

	return (
		<FieldContainer>
			<Field
				name={objectSchemaKey}
				defaultValue={selectedObjectSchema}
				validate={(value) => validateSchema(value)}
				testId={testId}
			>
				{({ fieldProps: { onChange, onFocus, ...restFieldProps } }) => (
					<PopupSelect
						autoFocus
						maxMenuWidth={300}
						minMenuWidth={300}
						isSearchable={true}
						searchThreshold={-1}
						isLoading={objectSchemasLoading}
						options={options}
						placeholder={formatMessage(objectSchemaSelectMessages.placeholder)}
						onChange={(newOption) => newOption && onChange(newOption)}
						inputValue={searchTerm}
						onInputChange={handleInputChange}
						onMenuClose={onClose}
						{...restFieldProps}
						label={formatMessage(objectSchemaSelectMessages.placeholder)}
						target={({ isOpen, ...triggerProps }) => (
							<Button
								{...triggerProps}
								isSelected={isOpen}
								iconAfter={() => <ChevronDownIcon label="" color="currentColor" size="small" />}
							>
								{restFieldProps.value?.label ||
									formatMessage(objectSchemaSelectMessages.placeholder)}
							</Button>
						)}
					/>
				)}
			</Field>
		</FieldContainer>
	);
};
