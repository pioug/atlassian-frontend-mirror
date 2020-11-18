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

/** maps the typed-values from the Form values object */
function extract(value: Parameters[string], field: FieldDefinition) {
  if (isOptions(value)) {
    return value.map(item => item.value);
  } else if (isOption(value)) {
    return value.value;
  } else if (isDateRange(value)) {
    return value;
  } else if (value !== undefined && field.type === 'number') {
    return Number(value);
  }

  return value;
}

export const serialize = async (
  manifest: ExtensionManifest,
  data: Parameters,
  fields: FieldDefinition[],
  depth: number = 0,
) => {
  const copy: Parameters = {};
  for (const field of fields) {
    const { name } = field;

    // missing? do nothing
    if (!(name in data)) {
      continue;
    }

    // ignore undefined values
    let value = extract(data[name], field);
    if (value === undefined) {
      continue;
    }

    // WARNING: don't recursively serialize, limit to depth < 1
    // serializable?
    if (isFieldset(field) && depth === 0) {
      const fieldSerializer = await getFieldSerializer(
        manifest,
        field.options.transformer,
      );

      if (fieldSerializer) {
        const extracted = await serialize(
          manifest,
          value,
          field.fields,
          depth + 1,
        );
        value = fieldSerializer(extracted);
      }
    }

    copy[name] = value;
  }

  return copy;
};

export const deserialize = async (
  manifest: ExtensionManifest,
  data: Parameters,
  fields: FieldDefinition[],
  depth: number = 0,
): Promise<Parameters> => {
  const copy: Parameters = {};

  for (const field of fields) {
    const { name } = field;

    // missing? do nothing
    if (!(name in data)) {
      continue;
    }

    // ignore undefined values
    let value = extract(data[name], field);
    if (value === undefined) {
      continue;
    }

    // WARNING: don't recursively serialize, limit to depth < 1
    // deserializable?
    if (isFieldset(field) && depth === 0) {
      const fieldDeserializer = await getFieldDeserializer(
        manifest,
        field.options.transformer,
      );

      if (fieldDeserializer) {
        try {
          value = fieldDeserializer(value);
        } catch (error) {
          copy.errors = {
            ...copy.errors,
            [name]: error.message,
          };

          continue;
        }

        value = await deserialize(manifest, value, field.fields, depth + 1);
      }
    }

    copy[name] = value;
  }

  return copy;
};
