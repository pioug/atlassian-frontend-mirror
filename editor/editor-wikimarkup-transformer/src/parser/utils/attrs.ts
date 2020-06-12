// querystring-es3 is used because the browser implementation of querystring behaves differently than the NodeJS module
// https://product-fabric.atlassian.net/browse/CS-2801
import { parse as parseQuery } from 'querystring-es3';

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
