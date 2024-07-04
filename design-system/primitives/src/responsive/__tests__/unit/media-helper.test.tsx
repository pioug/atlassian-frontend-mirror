import { media } from '../../index';

describe('media-helper', () => {
	it('exposes expected media queries', () => {
		expect(media).toMatchInlineSnapshot(`
		{
		  "above": {
		    "lg": "@media (min-width: 90rem)",
		    "md": "@media (min-width: 64rem)",
		    "sm": "@media (min-width: 48rem)",
		    "xl": "@media (min-width: 110.5rem)",
		    "xs": "@media (min-width: 30rem)",
		    "xxs": "@media all",
		  },
		  "below": {
		    "lg": "@media not all and (min-width: 90rem)",
		    "md": "@media not all and (min-width: 64rem)",
		    "sm": "@media not all and (min-width: 48rem)",
		    "xl": "@media not all and (min-width: 110.5rem)",
		    "xs": "@media not all and (min-width: 30rem)",
		  },
		  "only": {
		    "lg": "@media (min-width: 90rem) and (max-width: 110.49rem)",
		    "md": "@media (min-width: 64rem) and (max-width: 89.99rem)",
		    "sm": "@media (min-width: 48rem) and (max-width: 63.99rem)",
		    "xl": "@media (min-width: 110.5rem)",
		    "xs": "@media (min-width: 30rem) and (max-width: 47.99rem)",
		    "xxs": "@media (min-width: 0rem) and (max-width: 29.99rem)",
		  },
		}
	`);
	});
});
