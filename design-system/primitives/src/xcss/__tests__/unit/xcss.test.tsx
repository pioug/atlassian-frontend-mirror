// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import * as emotion from '@emotion/react';

import { xcss } from '../../xcss';

describe('xcss()', () => {
	beforeEach(() => {
		// @ts-expect-error
		jest.spyOn(emotion, 'css').mockImplementation((styles) => styles);
		jest.spyOn(console, 'warn').mockImplementation(jest.fn);
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('transforms token styles', () => {
		const styles = xcss({
			padding: 'space.100',
			margin: 'space.negative.200',
			// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
			top: 'space.negative.050',
			insetBlock: 'space.negative.150',
			zIndex: 'blanket',
			color: 'color.text',
			boxShadow: 'elevation.shadow.overflow',
			font: 'font.body.small',
			fontWeight: 'font.weight.bold',
			fontFamily: 'font.family.code',
		});

		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    "boxShadow": "var(--ds-shadow-overflow, 0px 0px 8px #091e423f, 0px 0px 1px #091e424f)",
		    "color": "var(--ds-text, #172B4D)",
		    "font": "var(--ds-font-body-small, normal 400 12px/16px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif)",
		    "fontFamily": "var(--ds-font-family-code, "Atlassian Mono", ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace)",
		    "fontWeight": "var(--ds-font-weight-bold, 653)",
		    "insetBlock": "var(--ds-space-negative-150, -12px)",
		    "margin": "var(--ds-space-negative-200, -16px)",
		    "padding": "var(--ds-space-100, 8px)",
		    "top": "var(--ds-space-negative-050, -4px)",
		    "zIndex": 500,
		  },
		}
	`);
	});

	it('handles CSSObjects with both token styles and non-token styles', () => {
		const styles = xcss({
			borderColor: 'color.border',
			justifyContent: 'center',
		});
		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    "borderColor": "var(--ds-border, #091e4221)",
		    "justifyContent": "center",
		  },
		}
	`);
	});

	it('transforms pseudo classes', () => {
		const styles = xcss({
			':hover': {
				display: 'flex',
				borderWidth: 'border.width.selected',
			},
			':visited': {
				borderWidth: 'border.width',
			},
		});

		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    ":hover": {
		      "borderWidth": "var(--ds-border-width-selected, 2px)",
		      "display": "flex",
		    },
		    ":visited": {
		      "borderWidth": "var(--ds-border-width, 1px)",
		    },
		  },
		}
	`);
	});

	it('allows CSS transitions', () => {
		const styles = xcss({
			transition: 'all 0.3s',
		});

		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    "transition": "all 0.3s",
		  },
		}
	`);
	});

	it('allows pseudo elements', () => {
		const styles = xcss({
			'::before': {
				content: '>',
			},
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			'@media (min-width: 110.5rem)': {
				':hover': {
					color: 'color.text',
				},
			},
		});

		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    "::before": {
		      "content": ">",
		    },
		    "@media (min-width: 110.5rem)": {
		      ":hover": {
		        "color": "var(--ds-text, #172B4D)",
		      },
		    },
		  },
		}
	`);
	});

	it('allows @supports elements', () => {
		const styles = xcss({
			'@supports not selector(*:focus-visible)': {
				padding: 'space.100',
			},
		});

		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    "@supports not selector(*:focus-visible)": {
		      "padding": "var(--ds-space-100, 8px)",
		    },
		  },
		}
	`);
	});

	it('allows valid interpolated keys', () => {
		const keyVariable = ':hover';

		const styles = xcss({
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			[keyVariable]: {
				gap: 'space.200',
			},
		});

		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    ":hover": {
		      "gap": "var(--ds-space-200, 16px)",
		    },
		  },
		}
	`);
	});

	it('allows non-token values to be passed through for tokenisable properties', () => {
		const styles = xcss({
			// @ts-expect-error
			padding: '10px',
			// @ts-expect-error
			color: '#F0F0F0',
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
			top: 0,
		});

		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    "color": "#F0F0F0",
		    "padding": "10px",
		    "top": 0,
		  },
		}
	`);
	});

	it('allows non-token values to be passed through for tokenisable properties', () => {
		const styles = xcss({
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			'@media (min-width: 100px)': {
				padding: 'space.100',
			},
			// @ts-expect-error
			padding: '10px',
			// @ts-expect-error
			color: '#F0F0F0',
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
			top: 0,
		});

		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    "@media (min-width: 100px)": {
		      "padding": "var(--ds-space-100, 8px)",
		    },
		    "color": "#F0F0F0",
		    "padding": "10px",
		    "top": 0,
		  },
		}
	`);
	});

	it('should not throw warning on flexShrink: 0', () => {
		const styles = xcss({
			flexShrink: '0',
		});

		expect(console.warn).not.toHaveBeenCalled();
		expect(styles).toMatchInlineSnapshot(`
		{
		  Symbol(UNSAFE_INTERNAL_styles): {
		    "flexShrink": "0",
		  },
		}
	`);
	});

	it('throws on unsupported selectors', () => {
		process.env.NODE_ENV = 'development';
		[
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			() => xcss({ '.container': { gap: 'space.200' } }),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			() => xcss({ '#some-id': { gap: 'space.200' } }),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			() => xcss({ '[data-testid="beep"]': { gap: 'space.200' } }),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			() => xcss({ 'div[aria-labelledby="boop"]': { gap: 'space.200' } }),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			() => xcss({ '> *': { gap: 'space.200' } }),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			() => xcss({ '&': { gap: 'space.200' } }),
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
			() => xcss({ '&&': { gap: 'space.200' } }),
		].forEach((fn) => {
			expect(() => fn()).toThrow();
		});
	});
});
