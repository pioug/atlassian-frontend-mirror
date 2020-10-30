/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
export const formattedParts = {
  day: '02',
  month: 'Apr',
  year: '2315',
  hour: '01',
  minute: '02',
  dayPeriod: 'PM',
};
export const mockFormatToParts = jest.fn().mockReturnValue(formattedParts);

jest.mock('@atlaskit/locale', () => ({
  createLocalizationProvider: jest.fn().mockReturnValue({
    formatToParts: mockFormatToParts,
  }),
}));
