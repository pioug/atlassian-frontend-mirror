import {
  Option,
  FieldDefinition,
  isFieldset,
  isDateRange,
  isTabGroup,
  isExpand,
  Parameters,
  ExtensionManifest,
  getFieldSerializer,
  getFieldDeserializer,
  ParametersWithDuplicateFields,
  TabField,
} from '@atlaskit/editor-common/extensions';
import { getNameFromDuplicateField, isDuplicateField } from './utils';

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
    return value.map((item) => item.value);
  } else if (isOption(value)) {
    return value.value;
  } else if (isDateRange(value)) {
    return value;
  } else if (value !== undefined && field.type === 'number') {
    if (value === '') {
      return;
    }
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
  const result: ParametersWithDuplicateFields = [];

  if (data) {
    for (const name in data) {
      const field = fields.find(
        (field) => field.name === getNameFromDuplicateField(name),
      );
      if (field === undefined) {
        continue;
      }

      // ignore undefined values
      let value = extract(data[name], field);
      if (value === undefined) {
        continue;
      }

      if (isTabGroup(field)) {
        const { fields: tabs } = field;
        value = {};

        const resolveTabValues = async (tabField: TabField, groupData: any) => {
          return await serialize(
            manifest,
            groupData[tabField.name] || {},
            tabField.fields,
          );
        };

        for (let i = 0; i < tabs.length; i++) {
          const tabField = tabs[i];
          value[tabField.name] = await resolveTabValues(
            tabField,
            data[field.name] || {},
          );
        }
      } else if (isExpand(field)) {
        value = await serialize(manifest, data[field.name] || {}, field.fields);
      }
      // WARNING: don't recursively serialize, limit to depth < 1
      // serializable?
      else if (isFieldset(field) && depth === 0) {
        const fieldSerializer = await getFieldSerializer(
          manifest,
          field.options.transformer,
        );

        if (fieldSerializer) {
          const { fields: fieldsetFields } = field;
          const extracted = await serialize(
            manifest,
            value,
            fieldsetFields,
            depth + 1,
          );
          value = fieldSerializer(extracted);
        }
      }

      result.push({ [field.name]: value });
    }
  }

  // when there are duplicate fields we return an array eg. [{ title: 'one' }, { title: 'two' }]
  // when there aren't we return an object eg. { title: 'one' }
  const hasDuplicateFields = !!Object.keys(data).find((key) =>
    isDuplicateField(key),
  );
  if (hasDuplicateFields) {
    return result;
  }
  return result.reduce<Parameters>((obj: Parameters, current: Parameters) => {
    for (const key in current) {
      obj[key] = current[key];
    }
    return obj;
  }, {});
};

function injectDefaultValues(
  data: Parameters | ParametersWithDuplicateFields,
  fields: FieldDefinition[],
) {
  const copy: ParametersWithDuplicateFields = [
    ...convertToParametersArray(data),
  ];

  for (const field of fields) {
    const { name } = field;
    const fieldIndex = copy.findIndex(
      (item: Parameters) => Object.entries(item)[0][0] === name,
    );

    if (fieldIndex >= 0 && !isFieldset(field)) {
      continue;
    }

    if (isFieldset(field)) {
      const { fields: fieldsetFields } = field;
      if (fieldIndex >= 0) {
        const fieldValue = Object.entries(copy[fieldIndex])[0][1];
        copy[fieldIndex] = {
          [name]: injectDefaultValues(fieldValue, fieldsetFields),
        };
      } else {
        copy.push({ [name]: injectDefaultValues({}, fieldsetFields) });
      }
    }

    if ('defaultValue' in field) {
      copy.push({ [name]: field.defaultValue });
    }
  }

  if (doParametersContainDuplicateFields(copy)) {
    return copy;
  }
  return convertToParametersObject(copy);
}

export const deserialize = async (
  manifest: ExtensionManifest,
  data: Parameters | ParametersWithDuplicateFields,
  fields: FieldDefinition[],
  depth: number = 0,
) => {
  const dataArray = convertToParametersArray(data);
  let result: Parameters | ParametersWithDuplicateFields = [];
  const errors: ParametersWithDuplicateFields = [];

  for (const item of dataArray) {
    const [name, originalValue] = Object.entries(item)[0];

    const field = fields.find(
      (field) => field.name === getNameFromDuplicateField(name),
    );
    if (field === undefined) {
      continue;
    }

    let value = extract(originalValue, field);
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
          errors.push({ [name]: error.message });
          continue;
        }

        value = await deserialize(manifest, value, field.fields, depth + 1);
      }
    }

    result.push({ [name]: value });
  }

  result = convertToParametersObject(result);

  if (errors.length > 0) {
    result.errors = convertToParametersObject(errors);
  }

  return injectDefaultValues(result, fields);
};

const doParametersContainDuplicateFields = (
  parameters: ParametersWithDuplicateFields,
) => {
  const keyMap = new Set();
  for (const param of parameters) {
    const key = Object.keys(param)[0];
    if (keyMap.has(key)) {
      return true;
    }
    keyMap.add(key);
  }
};

const convertToParametersObject = (
  parameters: Parameters | ParametersWithDuplicateFields = [],
) => {
  if (!Array.isArray(parameters)) {
    return parameters;
  }

  return parameters.reduce<Parameters>(
    (obj: Parameters, current: Parameters) => {
      for (const key in current) {
        const keys = Object.keys(obj);
        let resultKey = key;
        let idx = 1;
        while (keys.indexOf(resultKey) >= 0) {
          resultKey = `${getNameFromDuplicateField(key)}:${idx}`;
          idx++;
        }

        obj[resultKey] = current[key];
      }
      return obj;
    },
    {},
  );
};

const convertToParametersArray = (
  parameters: Parameters | ParametersWithDuplicateFields = {},
): ParametersWithDuplicateFields => {
  if (Array.isArray(parameters)) {
    return parameters;
  }
  const dataArray = [];
  for (const name in parameters) {
    dataArray.push({ [name]: parameters[name] });
  }
  return dataArray;
};
