import {
  isDateRange,
  DateRangeResult,
} from '@atlaskit/editor-common/extensions';
import {
  Parameters,
  ParametersWithDuplicateFields,
} from '@atlaskit/editor-common/extensions';
import {
  getNameFromDuplicateField,
  toEntries,
} from '../../src/ui/ConfigPanel/utils';

function escapeHtmlEntities(value: string) {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function unescapeHtmlEntities(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function serializeDateRange(fieldName: string, value: DateRangeResult): string {
  let expressions = [];

  if (value.from && value.to) {
    expressions.push(`${fieldName} >= "${value.from}"`);
  }

  if (value.from && !value.to) {
    expressions.push(`${fieldName} >= ${value.from}`);
  }

  if (value.to) {
    expressions.push(`${fieldName} <= "${value.to}"`);
  }

  return escapeHtmlEntities(expressions.join(' and '));
}

function deserializeDateRangeEntry(dateRange: string): Entry<DateRangeResult> {
  const expressions = dateRange.split(' and ');
  let fieldName: string = '';
  const [from, to] = expressions.map((expression) => {
    const [key, value] = unescapeHtmlEntities(expression).split(
      new RegExp('>=|<='),
    );

    fieldName = key.trim();

    return value.replace(/"/g, '').trim();
  });

  const value = from && to ? 'custom' : from;
  return [
    fieldName,
    {
      type: 'date-range',
      value,
      from,
      to,
    },
  ];
}

export const cqlSerializer = (content: Parameters) => {
  const cql = toEntries(content)
    .filter((entry) => entry[1])
    .map((entry) => {
      const [key, value] = entry;

      let joiner = '=';
      let result = value;

      if (isDateRange(value)) {
        return serializeDateRange(key, value);
      } else if (Array.isArray(value)) {
        joiner = 'in';
        result = `(${value.join(', ')})`;
      }

      return `${getNameFromDuplicateField(key)} ${joiner} ${result}`;
    })
    .join(' AND ');

  return cql;
};

type Entry<T> = [string, T];

export const cqlDeserializer = (
  value?: string,
): ParametersWithDuplicateFields => {
  if (typeof value === 'undefined') {
    return [];
  }

  const deserialized: Array<{
    [name: string]: string | string[] | DateRangeResult;
  }> = [];
  value.split(' AND ').forEach((statement) => {
    const [key, separator, val] = statement.split(/\s(=|in)\s/);

    let resultKey = key;
    let result: string | string[] | DateRangeResult = val;

    if (separator === 'in') {
      result = val.replace(/(\(|\))/g, '').split(', ');
    }

    if (key.includes(escapeHtmlEntities('>='))) {
      return deserializeDateRangeEntry(key);
    }

    deserialized.push({ [resultKey]: result });
  });

  return deserialized;
};
