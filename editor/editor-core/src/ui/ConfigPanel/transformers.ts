import {
  Option,
  FieldDefinition,
  isFieldset,
  isDateRange,
  Parameters,
  ExtensionManifest,
  getFieldSerializer,
  getFieldDeserializer,
} from '@atlaskit/editor-common/extensions';

const isOption = (option: any): option is Option => {
  return (
    option &&
    typeof option === 'object' &&
    'label' in option &&
    'value' in option
  );
};

const isOptions = (options: any): options is Option[] => {
  return Array.isArray(options) && options.every(isOption);
};

/**
 * Extracts the values from the full form serialization.
 *
 * example:
 * ```
 * {
 *   selectFieldName: {
 *    value: 'foo',
 *    label: 'Foo'
 *   }
 * }
 * ```
 * will turn into
 * ```
 * {
 *  selectFieldName: 'foo'
 * }
 * ```
 * @param formData
 */

const extractValues = (formData: Parameters): Parameters => {
  return Object.entries(formData).reduce<Parameters>((prev, entry) => {
    const [key, value] = entry;

    if (typeof value === 'undefined') {
      return prev;
    }

    if (isOptions(value)) {
      const values = value.map(item => item.value);
      prev[key] = values;
    } else if (isOption(value)) {
      prev[key] = value.value;
    } else if (isDateRange(value)) {
      prev[key] = value;
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
  formData: Parameters,
  fields: FieldDefinition[],
) => {
  const parameters = extractValues(formData);

  const processedParameters = { ...parameters };

  const serializableFields = getSerializableFields(fields);

  for (const serializableField of serializableFields) {
    if (serializableField.options && serializableField.options.transformer) {
      const serializer = await getFieldSerializer(
        manifest,
        serializableField.options.transformer,
      );

      if (serializer) {
        processedParameters[serializableField.name] = serializer(
          extractValues(parameters[serializableField.name]),
        );
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
      const deserializer = await getFieldDeserializer(
        manifest,
        serializableField.options.transformer,
      );

      if (deserializer) {
        try {
          const deserializationResult = deserializer(
            params[serializableField.name],
          );
          parsedParameters = {
            ...parsedParameters,
            [serializableField.name]: deserializationResult,
          };
        } catch (error) {
          parsedParameters = {
            ...parsedParameters,
            errors: {
              ...(parsedParameters.errors || {}),
              [serializableField.name]: error.message,
            },
          };
        }
      }
    }
  }

  return parsedParameters;
};
