import {
  Option,
  FieldDefinition,
  isFieldset,
  isDateRange,
  isTabGroup,
  isTabField,
  isExpand,
  Parameters,
  ExtensionManifest,
  getFieldSerializer,
  getFieldDeserializer,
  ParametersWithDuplicateFields,
  TabGroupField,
  TabField,
  ExpandField,
  Fieldset,
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

type ExtractOptions = {
  useDefaultValue?: boolean;
};
/** maps the typed-values from the Form values object */
function extract(
  value: Parameters[string],
  field: FieldDefinition,
  options?: ExtractOptions,
) {
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
  // Workaround for https://product-fabric.atlassian.net/browse/DST-2701
  else if (
    options?.useDefaultValue &&
    value === undefined &&
    'defaultValue' in field
  ) {
    return field.defaultValue;
  }

  return value;
}

interface SerializeOptions {
  depth?: number;
  parentType?: 'fieldset' | 'tab' | 'expand';
}

export const findDuplicateFields = (
  fields: FieldDefinition[],
): FieldDefinition | undefined =>
  findDuplicateFieldsInternal(flattenFields(fields));

const findDuplicateFieldsInternal = (
  fields: FieldDefinition[],
): FieldDefinition | undefined => {
  const allowDuplicatesMap: { [key: string]: boolean } = {};
  return fields.find((field) => {
    if (isExpand(field)) {
      return findDuplicateFieldsInternal(field.fields);
    } else if (isTabGroup(field)) {
      return field.fields.find((tabField) =>
        findDuplicateFieldsInternal(tabField.fields),
      );
    } else if (allowDuplicatesMap[field.name] === undefined) {
      allowDuplicatesMap[field.name] = !!field.allowDuplicates;
      return;
    } else if (!field.allowDuplicates || !allowDuplicatesMap[field.name]) {
      return field;
    }

    return;
  });
};

export const serialize = async (
  manifest: ExtensionManifest,
  data: Parameters,
  fields: FieldDefinition[],
  options: SerializeOptions = {},
): Promise<Parameters> => {
  const result: ParametersWithDuplicateFields = [];
  const { depth = 0, parentType } = options;
  const flattenedFields = flattenFields(fields);

  const fillResults = flattenedFields.map(async (field) => {
    if (isTabGroup(field)) {
      const tabGroupData = await serializeTabGroupField(manifest, field, data);
      result.push(...tabGroupData);
    } else if (isTabField(field)) {
      const tabData = await serializeTabField(manifest, field, data);
      result.push(...tabData);
    } else if (isExpand(field)) {
      const expandData = await serializeExpandField(manifest, field, data);
      result.push(...expandData);
    }
    // WARNING: don't recursively serialize, limit to depth < 1
    // serializable?
    else if (isFieldset(field) && depth === 0) {
      const fieldsetData = await serializeFieldset(
        manifest,
        field,
        data,
        depth,
      );

      if (fieldsetData) {
        result.push(fieldsetData);
      }
    } else {
      const value = extract(data[field.name], field, { useDefaultValue: true });

      // ignore undefined values
      if (value !== undefined) {
        result.push({ [field.name]: value });
      }
    }
  });

  await Promise.all(fillResults);

  // Crunch fields down to parameters
  const parameters = result.reduce<Parameters>(
    (obj: Parameters, current: Parameters) => {
      for (const key in current) {
        obj[key] = current[key];
      }
      return obj;
    },
    {},
  );

  // Fix up duplicate values (currently only for fieldsets)
  const hasDuplicateFields =
    parentType === 'fieldset' &&
    !!flattenedFields.find((field) => field.allowDuplicates);

  if (hasDuplicateFields) {
    return serializeMergeDuplicateFieldData(parameters, data, flattenedFields);
  }

  return parameters;
};

const serializeFieldset = async (
  manifest: ExtensionManifest,
  field: Fieldset,
  data: Parameters,
  depth: number,
): Promise<Parameters | undefined> => {
  let fieldSerializer;

  try {
    fieldSerializer = await getFieldSerializer(
      manifest,
      field.options.transformer,
    );
  } catch (ex) {
    // We only throw if there is data that may be lost
    if (data[field.name] !== undefined) {
      throw ex;
    }
  }

  if (!fieldSerializer) {
    return;
  }

  const { fields: fieldsetFields } = field;
  const fieldParams =
    extract(data[field.name], field, { useDefaultValue: true }) || {};
  const extracted = await serialize(manifest, fieldParams, fieldsetFields, {
    depth: depth + 1,
    parentType: 'fieldset',
  });

  return { [field.name]: fieldSerializer(extracted) };
};

const serializeExpandField = async (
  manifest: ExtensionManifest,
  field: ExpandField,
  data: Parameters,
): Promise<ParametersWithDuplicateFields> => {
  const expandData = field.hasGroupedValues ? data[field.name] || {} : data;
  const value = await serialize(manifest, expandData, field.fields, {
    parentType: 'expand',
  });
  const results: ParametersWithDuplicateFields = [];

  if (!field.hasGroupedValues) {
    for (const fieldName in value) {
      results.push({ [fieldName]: value[fieldName] });
    }
  } else {
    results.push({ [field.name]: value });
  }

  return results;
};

const resolveTabValues = async (
  manifest: ExtensionManifest,
  tabField: TabField,
  groupData: Parameters,
) => {
  const tabFieldParams = tabField.hasGroupedValues
    ? groupData[tabField.name] || {}
    : groupData;
  return await serialize(manifest, tabFieldParams, tabField.fields, {
    parentType: 'tab',
  });
};

const serializeTabGroupField = async (
  manifest: ExtensionManifest,
  field: TabGroupField,
  data: Parameters,
): Promise<ParametersWithDuplicateFields> => {
  const { fields: tabs } = field;
  const results: ParametersWithDuplicateFields = [];
  const value: Parameters = {};

  for (let i = 0; i < tabs.length; i++) {
    const tabField = tabs[i];

    const tabFieldParameters = await resolveTabValues(
      manifest,
      tabField,
      field.hasGroupedValues ? data[field.name] || {} : data,
    );

    if (tabField.hasGroupedValues) {
      // Keep namespaced by tab
      value[tabField.name] = tabFieldParameters;
    } else {
      // Copy into tabGroup value
      for (const fieldName in tabFieldParameters) {
        value[fieldName] = tabFieldParameters[fieldName];
      }
    }
  }

  // Now for tabGroup...
  if (field.hasGroupedValues) {
    results.push({ [field.name]: value });
  } else {
    for (const fieldName in value) {
      results.push({ [fieldName]: value });
    }
  }

  return results;
};

const serializeTabField = async (
  manifest: ExtensionManifest,
  field: TabField,
  data: Parameters,
): Promise<ParametersWithDuplicateFields> => {
  const results: ParametersWithDuplicateFields = [];
  const tabField: TabField = field;
  const tabFieldParameters = await resolveTabValues(manifest, tabField, data);

  if (tabField.hasGroupedValues) {
    // Keep namespaced by tab
    results.push({ [tabField.name]: tabFieldParameters });
  } else {
    // Copy into tabGroup value
    for (const fieldName in tabFieldParameters) {
      results.push({ [fieldName]: tabFieldParameters[fieldName] });
    }
  }

  return results;
};

const serializeMergeDuplicateFieldData = (
  parameters: Parameters,
  formData: Parameters,
  flattenedFields: FieldDefinition[],
) => {
  // Weed out all the non-duplicate field names
  const allDuplicateFieldNames = Object.keys(formData).filter((key) =>
    isDuplicateField(key),
  );

  return flattenedFields.reduce((newParams, field) => {
    const paramValue = parameters[field.name];
    if (!field.allowDuplicates && paramValue !== undefined) {
      newParams[field.name] = paramValue;
    } else {
      // extract the given duplicate values through the field
      const duplicateValues = allDuplicateFieldNames
        .filter((name) => getNameFromDuplicateField(name) === field.name)
        .map((duplicateFieldName) =>
          extract(formData[duplicateFieldName], field, {
            useDefaultValue: true,
          }),
        );
      // Merge and ensure that all values are worth serializing
      const mergedValues = [
        paramValue, // first value
        ...duplicateValues,
      ].filter((value) => value !== undefined);

      if (mergedValues.length > 0) {
        // Replace so the duplicate field values are saved under the
        // fieldName as an array
        newParams[field.name] = mergedValues;
      }
    }

    return newParams;
  }, {} as Parameters);
};

function injectDefaultValues(
  data: Parameters | ParametersWithDuplicateFields,
  fields: FieldDefinition[],
): Parameters {
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

  return convertToParametersObject(copy);
}

/**
 * Flattens the given FieldDefinition[] so it resembles the expected data
 * structure in result Parameters.
 */
const flattenFields = (fields: FieldDefinition[]): FieldDefinition[] => {
  const flattenAccumulator = (
    accumulator: FieldDefinition[],
    field: FieldDefinition,
  ) => {
    if (isTabGroup(field)) {
      if (field.hasGroupedValues) {
        accumulator.push(field);
      } else {
        const flattenedTabs = field.fields.reduce(
          (tabAccumulator: FieldDefinition[], tab: TabField) => {
            return tabAccumulator.concat(
              tab.hasGroupedValues
                ? (tab as any)
                : tab.fields.reduce(flattenAccumulator, []),
            );
          },
          [],
        );
        accumulator.push(...flattenedTabs);
      }
    } else if (isExpand(field)) {
      if (field.hasGroupedValues) {
        accumulator.push(field);
      } else {
        const flattenedExpand = field.fields.reduce(flattenAccumulator, []);
        accumulator.push(...flattenedExpand);
      }
    } else {
      accumulator.push(field);
    }

    return accumulator;
  };

  return fields.reduce(flattenAccumulator, []);
};

export const deserialize = async (
  manifest: ExtensionManifest,
  data: Parameters | ParametersWithDuplicateFields,
  fields: FieldDefinition[],
  depth: number = 0,
): Promise<Parameters> => {
  const dataArray = convertToParametersArray(data);
  let result: Parameters | ParametersWithDuplicateFields = [];
  const errors: ParametersWithDuplicateFields = [];

  const flattenedFields = flattenFields(fields);

  for (const item of dataArray) {
    const [name, originalValue] = Object.entries(item)[0];

    const field = flattenedFields.find(
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
          errors.push({
            [name]: error instanceof Error ? error.message : String(error),
          });
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

  return injectDefaultValues(result, flattenedFields);
};

const convertToParametersObject = (
  parameters: Parameters | ParametersWithDuplicateFields = [],
): Parameters => {
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
