// fakeIntl["..."] here to indicate those went through formatMessage and not just left as string itself
export const fakeIntl: any = {
  formatMessage: jest.fn(
    ({ defaultMessage }) => `fakeIntl["${defaultMessage}"]`,
  ),
};
