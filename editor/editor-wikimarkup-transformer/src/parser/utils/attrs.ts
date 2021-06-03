export function parseAttrs(
  str?: string,
  sep: string = '|',
): { [key: string]: string } {
  const output: { [key: string]: string } = {};
  if (!str) {
    return output;
  }
  const attributesStr = str.split(sep);
  attributesStr.forEach((attributeStr) => {
    const [key, ...value] = attributeStr.split('=');
    // take only first value of the same keys
    if (!output[key]) {
      output[key] = value.join('=');
    }
  });

  return output;
}
