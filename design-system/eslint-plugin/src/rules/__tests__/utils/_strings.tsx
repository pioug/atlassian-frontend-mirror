export const linesOnly = (
  strings: TemplateStringsArray,
  ...values: string[]
): string =>
  String.raw(strings, ...values)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n /g, '\n');
