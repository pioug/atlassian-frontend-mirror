import { media } from '../index';

describe('media-helper', () => {
  it('exposes expected media queries', () => {
    expect(media).toMatchInlineSnapshot(`
      Object {
        "above": Object {
          "lg": "@media (min-width: 90rem)",
          "md": "@media (min-width: 64rem)",
          "sm": "@media (min-width: 48rem)",
          "xl": "@media (min-width: 110rem)",
          "xs": "@media (min-width: 30rem)",
          "xxs": "@media all",
        },
      }
    `);
  });
});
