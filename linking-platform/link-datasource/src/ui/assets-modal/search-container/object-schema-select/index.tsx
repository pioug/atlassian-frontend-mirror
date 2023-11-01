/** @jsx jsx */

import { useEffect, useState } from 'react';

import { jsx } from '@emotion/react';
import debounce from 'debounce-promise';
import { useIntl } from 'react-intl-next';

import { Field } from '@atlaskit/form';
import { AsyncSelect } from '@atlaskit/select';
import { layers } from '@atlaskit/theme/constants';

import { useDatasourceAnalyticsEvents } from '../../../../analytics';
import { useObjectSchemas } from '../../../../hooks/useObjectSchemas';
import {
  ObjectSchema,
  objectSchemaKey,
  ObjectSchemaOption,
} from '../../../../types/assets/types';
import { FieldContainer } from '../styled';

import { objectSchemaSelectMessages } from './messages';
import { objectSchemaToSelectOption } from './utils';

type AssetsObjectSchemaSelectProps = {
  value: ObjectSchema | undefined;
  workspaceId: string;
  classNamePrefix?: string;
};

export const SEARCH_DEBOUNCE_MS = 350;

const mapObjectSchemasToOptions = (
  objectSchemas: ObjectSchema[] | undefined,
) => {
  return objectSchemas
    ? objectSchemas.map(objectSchema =>
        objectSchemaToSelectOption(objectSchema),
      )
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
  classNamePrefix = 'assets-datasource-modal--object-schema-select',
}: AssetsObjectSchemaSelectProps) => {
  const [defaultOptions, setDefaultOptions] = useState<
    ObjectSchemaOption[] | null
  >(null);
  const { fireEvent } = useDatasourceAnalyticsEvents();
  const { formatMessage } = useIntl();
  const { fetchObjectSchemas, objectSchemasLoading } =
    useObjectSchemas(workspaceId);

  const selectedObjectSchema = value
    ? objectSchemaToSelectOption(value)
    : undefined;

  useEffect(() => {
    const fetchInitialData = async () => {
      const { objectSchemas, totalObjectSchemas } = await fetchObjectSchemas(
        '',
      );
      // We only want to send modal ready event once after we've fetched the schema count
      fireEvent('ui.modal.ready.datasource', {
        schemasCount: totalObjectSchemas ?? 0,
        instancesCount: null,
      });
      setDefaultOptions(mapObjectSchemasToOptions(objectSchemas));
    };
    if (defaultOptions === null) {
      fetchInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        validate={value => validateSchema(value)}
      >
        {({ fieldProps: { onChange, onFocus, ...restFieldProps } }) => (
          <AsyncSelect
            autoFocus
            classNamePrefix={classNamePrefix}
            isLoading={objectSchemasLoading}
            defaultOptions={defaultOptions ?? []}
            isSearchable
            loadOptions={debouncedLoadOptions}
            placeholder={formatMessage(objectSchemaSelectMessages.placeholder)}
            onChange={newOption => newOption && onChange(newOption)}
            {...selectInAModalStyleFixProps}
            {...restFieldProps}
          />
        )}
      </Field>
    </FieldContainer>
  );
};
