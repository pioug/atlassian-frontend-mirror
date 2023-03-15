import { UNSAFE_media } from '../index';

describe('media-helper', () => {
  it('exposes expected media queries', () => {
    expect(UNSAFE_media).toMatchInlineSnapshot(`
      Object {
        "above": Object {
          "lg": "@media (min-width: 1440px)",
          "md": "@media (min-width: 1024px)",
          "sm": "@media (min-width: 768px)",
          "xl": "@media (min-width: 1768px)",
          "xs": "@media (min-width: 480px)",
          "xxl": "@media (min-width: 2160px)",
          "xxs": "@media (min-width: 0px)",
        },
        "below": Object {
          "lg": "@media (max-width: 1439.98px)",
          "md": "@media (max-width: 1023.98px)",
          "sm": "@media (max-width: 767.98px)",
          "xl": "@media (max-width: 1767.98px)",
          "xs": "@media (max-width: 479.98px)",
          "xxl": "@media (max-width: 2159.98px)",
        },
      }
    `);
  });
});
