import { isNestedHeaderLinksEnabled } from '../../../react/utils/links';

describe('Nested header links: Enablement', () => {
  it('should return false if allowHeadingAnchorLinks is a boolean', () => {
    expect(isNestedHeaderLinksEnabled(false)).toBe(false);
    expect(isNestedHeaderLinksEnabled(true)).toBe(false);
  });
  it(`should return false if allowHeadingAnchorLinks isn't provided`, () => {
    expect(isNestedHeaderLinksEnabled(undefined)).toBe(false);
    expect(isNestedHeaderLinksEnabled({})).toBe(false);
  });
  it(`should return false if allowHeadingAnchorLinks.allowNestedHeaderLinks isn't enabled`, () => {
    expect(isNestedHeaderLinksEnabled({ allowNestedHeaderLinks: false })).toBe(
      false,
    );
  });
  it(`should return true if allowHeadingAnchorLinks.allowNestedHeaderLinks is enabled`, () => {
    expect(isNestedHeaderLinksEnabled({ allowNestedHeaderLinks: true })).toBe(
      true,
    );
  });
});
