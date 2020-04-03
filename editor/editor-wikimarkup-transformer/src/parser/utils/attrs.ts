import { parse as parseQuery } from 'querystring';

export function parseAttrs(
  str: string,
  sep: string = '|',
): { [key: string]: string } {
  const output = parseQuery(str, sep);

  // take only first value of the same keys
  Object.keys(output).forEach(key => {
    if (Array.isArray(output[key])) {
      output[key] = output[key][0];
    }
  });

  return output as { [key: string]: string };
}
