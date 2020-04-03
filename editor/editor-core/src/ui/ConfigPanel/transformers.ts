import {
  Option,
  FieldDefinition,
  isFieldset,
  Parameters,
  ExtensionManifest,
  getFieldSerializer,
  getFieldDeserializer,
} from '@atlaskit/editor-common/extensions';

import { FormResult } from './types';

import { fromEntries } from './utils';

const isOption = (option: any): option is Option => {
  return typeof option === 'object' && 'label' in option && 'value' in option;
};

const isOptions = (options: any): options is Option[] => {
  return Array.isArray(options) && options.every(isOption);
};

const getParametersFromFormData = (formData: FormData): FormResult => {
  return Object.entries(formData).reduce<FormResult>((prev, entry) => {
    const [key, value] = entry;

    if (isOptions(value)) {
      const values = value.map(item => item.value);
      prev[key] = values;
    } else if (isOption(value)) {
      prev[key] = value.value;
    } else {
      prev[key] = value;
    }

    return prev;
  }, {});
};

const getSerializableFields = (fields: FieldDefinition[]) =>
  fields.filter(isFieldset);

export const serialize = async (
  manifest: ExtensionManifest,
  formData: FormData,
  fields: FieldDefinition[],
) => {
  const parameters = getParametersFromFormData(formData);

  const processedParameters = { ...parameters };

  const serializableFields = getSerializableFields(fields);

  for (const serializableField of serializableFields) {
    if (serializableField.options && serializableField.options.transformer) {
      const fieldNames = serializableField.fields.map(field => field.name);

      const serializer = await getFieldSerializer(
        manifest,
        serializableField.options.transformer,
      );

      if (serializer) {
        serializableField.fields.forEach(field => {
          delete processedParameters[field.name];
        });

        const values = fromEntries(
          fieldNames.map(fieldName => {
            return [fieldName, parameters[fieldName]];
          }),
        );

        processedParameters[serializableField.name] = serializer(values);
      }
    }
  }

  return processedParameters;
};

export const deserialize = async (
  manifest: ExtensionManifest,
  params: Parameters,
  fields: FieldDefinition[],
): Promise<Parameters> => {
  let parsedParameters = { ...params };

  const serializableFields = getSerializableFields(fields);

  for (const serializableField of serializableFields) {
    if (
      serializableField.options &&
      serializableField.options.transformer &&
      parsedParameters[serializableField.name]
    ) {
      delete parsedParameters[serializableField.name];

      const deserializer = await getFieldDeserializer(
        manifest,
        serializableField.options.transformer,
      );

      if (deserializer) {
        const deserializationResult = deserializer(
          params[serializableField.name],
        );

        parsedParameters = {
          ...parsedParameters,
          ...deserializationResult,
        };
      }
    }
  }

  return parsedParameters;
};
