export type FormattedParts = Record<Intl.DateTimeFormatPartTypes, string>;
/**
 * Converts the output of Intl.DateTimeFormat.formatToParts of type
 * `[ { type: 'day', value: '17' }, { type: 'month', value: '3' }, ... ]`
 * into an indexed object of type
 * `{ day: '17', month: '3', ... }`
 */
export const toFormattedParts = (
  rawParts: Intl.DateTimeFormatPart[],
): FormattedParts =>
  rawParts.reduce(
    (result, datePart) => ({
      ...result,
      [datePart.type]: datePart.value,
    }),
    {} as FormattedParts,
  );
