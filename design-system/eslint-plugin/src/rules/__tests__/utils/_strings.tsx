export const linesOnly = (
  strings: TemplateStringsArray,
  ...values: string[]
): string =>
  strings
    .reduce((result, string, i) => result + (values[i] || '') + string)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n /g, '\n');
