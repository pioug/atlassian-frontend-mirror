import {
  isDateRange,
  DateRangeResult,
} from '@atlaskit/editor-common/extensions';

type Parameters = {
  [key: string]: any;
};

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
  const [from, to] = expressions.map(expression => {
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
  const cql = Object.entries(content)
    .filter(entry => entry[1])
    .map(entry => {
      const [key, value] = entry;

      let joiner = '=';
      let result = value;

      if (isDateRange(value)) {
        return serializeDateRange(key, value);
      } else if (Array.isArray(value)) {
        joiner = 'in';
        result = `(${value.join(', ')})`;
      }

      return `${key} ${joiner} ${result}`;
    })
    .filter(entry => entry[1])
    .join(' AND ');

  return cql;
};

type Entry<T> = [string, T];

const fromEntries = <T>(iterable: Entry<T>[]): Parameters => {
  return [...iterable].reduce<{ [key: string]: T }>((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {});
};

export const cqlDeserializer = (value?: string): Parameters => {
  if (typeof value === 'undefined') {
    return {};
  }

  const entries = value
    .split(' AND ')
    .map<Entry<string | string[] | DateRangeResult>>(statement => {
      const [key, separator, val] = statement.split(/\s(=|in)\s/);

      let result: string | string[] | DateRangeResult = val;

      if (separator === 'in') {
        result = val.replace(/(\(|\))/g, '').split(', ');
      }

      if (key.includes(escapeHtmlEntities('>='))) {
        return deserializeDateRangeEntry(key);
      }

      return [key, result];
    });

  return fromEntries<string | string[] | DateRangeResult>(entries);
};
