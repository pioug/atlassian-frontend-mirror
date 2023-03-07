import { UNSAFE_media } from '../../media-helper';

describe('media-helper', () => {
  it('does not throw an error when not nested', () => {
    expect(UNSAFE_media).toMatchInlineSnapshot(`
      Object {
        "above": Object {
          "lg": "@media (min-width: 1440px)",
          "md": "@media (min-width: 1024px)",
          "sm": "@media (min-width: 592px)",
          "xl": "@media (min-width: 1768px)",
          "xs": "@media (min-width: 0px)",
          "xxl": "@media (min-width: 2160px)",
        },
        "below": Object {
          "lg": "@media (max-width: 1439.98px)",
          "md": "@media (max-width: 1023.98px)",
          "sm": "@media (max-width: 591.98px)",
          "xl": "@media (max-width: 1767.98px)",
          "xxl": "@media (max-width: 2159.98px)",
        },
      }
    `);
  });
});
