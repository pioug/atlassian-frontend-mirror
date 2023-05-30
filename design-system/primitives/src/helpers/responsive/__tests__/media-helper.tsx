import { UNSAFE_media } from '../index';

describe('media-helper', () => {
  it('exposes expected media queries', () => {
    expect(UNSAFE_media).toMatchInlineSnapshot(`
      Object {
        "above": Object {
          "lg": "@media (min-width: 90rem)",
          "md": "@media (min-width: 64rem)",
          "sm": "@media (min-width: 48rem)",
          "xl": "@media (min-width: 110rem)",
          "xs": "@media (min-width: 30rem)",
          "xxl": "@media (min-width: 135rem)",
          "xxs": "@media (min-width: 0rem)",
        },
        "below": Object {
          "lg": "@media (max-width: 89.998rem)",
          "md": "@media (max-width: 63.998rem)",
          "sm": "@media (max-width: 47.998rem)",
          "xl": "@media (max-width: 109.998rem)",
          "xs": "@media (max-width: 29.998rem)",
          "xxl": "@media (max-width: 134.998rem)",
        },
      }
    `);
  });
});
