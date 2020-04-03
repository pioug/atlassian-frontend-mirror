type Parameters = {
  [key: string]: any;
};

export const cqlSerializer = (content: Parameters) => {
  const cql = Object.entries(content)
    .filter(entry => entry[1])
    .map(entry => {
      const [key, value] = entry;

      let joiner = '=';
      let result = value;

      if (Array.isArray(value)) {
        joiner = 'in';
        result = `(${value.join(', ')})`;
      }

      return `${key} ${joiner} ${result}`;
    })
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
    .map<Entry<string | string[]>>(statement => {
      const [key, separator, val] = statement.split(/\s(=|in)\s/);

      let result: string | string[] = val;

      if (separator === 'in') {
        result = val.replace(/(\(|\))/g, '').split(', ');
      }

      return [key, result];
    });

  return fromEntries<string | string[]>(entries);
};
