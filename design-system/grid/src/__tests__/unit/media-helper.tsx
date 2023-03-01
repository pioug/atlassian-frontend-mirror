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
          "lg": "@media (max-width: 1767px)",
          "md": "@media (max-width: 1439px)",
          "sm": "@media (max-width: 1023px)",
          "xl": "@media (max-width: 2159px)",
          "xs": "@media (max-width: 591px)",
          "xxl": "@media (max-width: 9007199254740991px)",
        },
        "between": Object {
          "lg": "@media (min-width: 1440px) and (max-width: 1767px)",
          "md": "@media (min-width: 1024px) and (max-width: 1439px)",
          "sm": "@media (min-width: 592px) and (max-width: 1023px)",
          "xl": "@media (min-width: 1768px) and (max-width: 2159px)",
          "xs": "@media (min-width: 0px) and (max-width: 591px)",
          "xxl": "@media (min-width: 2160px) and (max-width: 9007199254740991px)",
        },
      }
    `);
  });
});
