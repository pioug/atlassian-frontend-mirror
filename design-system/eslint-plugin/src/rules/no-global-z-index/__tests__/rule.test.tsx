import { tester, typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule from '../index';

const error = (value: number | string) => ({
	messageId: 'noGlobalZIndex',
	data: { value: String(value) },
});

tester.run('no-global-z-index', rule, {
	valid: [
		// Local ordering
		{ code: `const styles = css({ zIndex: 1 })` },
		{ code: `const styles = css({ zIndex: 10 })` },
		{ code: `const styles = css({ zIndex: '10' })` },
		{ code: `const styles = css({ zIndex: 0 })` },
		{ code: `const styles = css({ zIndex: -1 })` },
		{ code: `const styles = css({ zIndex: -9999 })` },
		{ code: `const styles = css({ zIndex: 'auto' })` },
		{ code: `const styles = css({ zIndex: 'inherit' })` },
		{ code: `const styles = css({ '&:hover': { zIndex: 2 } })` },
		{ code: `const styles = cssMap({ root: { zIndex: 1 } })` },
		{ code: `const styles = xcss({ zIndex: 5 })` },
		{ code: `const Box = styled.div({ zIndex: 3 })` },
		{ code: `const el = <div style={{ zIndex: 1 }} />` },
		{ code: `const el = <Portal zIndex={10} />` },
		{ code: `const el = <Portal zIndex="2" />` },
		{ code: `const styles = css\`z-index: 1;\`` },
		{ code: `const Box = styled.div\`color: red; z-index: 10;\`` },
		{ code: `element.style.zIndex = '1'` },
		{ code: `element.style.setProperty('z-index', '2')` },
		{ code: `const LOCAL = 2; const styles = css({ zIndex: LOCAL })` },
		{ code: `const styles = css({ zIndex: isOpen ? 2 : 1 })` },

		// Values we can't know from the file alone
		{ code: `import { Z } from './z'; const styles = css({ zIndex: Z })` },
		{ code: `const styles = css({ zIndex: layers.modal() })` },
		{ code: `const styles = css({ zIndex: getZIndex() })` },
		{ code: `const styles = css({ zIndex: 'calc(var(--z) + 1)' })` },
		{ code: `const styles = css({ zIndex: base + 500 })` },
		{ code: `let z = 500; const styles = css({ zIndex: z })` },
		{ code: `const styles = css\`z-index: \${layers.modal()};\`` },
		{ code: `const styles = css\`z-index: 1\${suffix};\`` },
		{ code: `const styles = css\`z-index: var(--ds-z-index);\`` },
		{ code: `const styles = css({ zIndex: token('elevation.zIndex') })` },

		// Not a z-index
		{ code: `const styles = css({ order: 500 })` },
		{ code: `const styles = css({ [key]: 500 })` },
		{ code: `const { zIndex } = props` },
		{ code: `const { zIndex = 500 } = props` },
		{ code: `element.style[zIndex] = 500` },
		{ code: `const el = <Popup zIndexOffset={500} />` },
		{ code: `const styles = css\`max-z-index-ish: 500;\`` },
		{ code: `const styles = css\`padding: 500px;\`` },
		{ code: `map.setProperty('z-index')` },
		{ code: `const text = 'z-index: 500'` },

		// Logical expressions: `&&` can only be its right side
		{ code: `const styles = css({ zIndex: options.zIndex ?? 1 })` },
		{ code: `const styles = css({ zIndex: 500 && 1 })` },

		// `calc()` other than `calc(infinity)`
		{ code: `const styles = css({ zIndex: 'calc(1 + 1)' })` },
		{ code: `const styles = css({ zIndex: 'calc(-infinity)' })` },

		// Only `<something>.style.zIndex` writes are CSS
		{ code: `options.zIndex = 500` },
		{ code: `this.zIndex = 500` },
		{ code: `layer.config.zIndex = 500` },
		{ code: `style.zIndex = 500` },
		{ code: `element.style.zIndex += 500` },
		{ code: `element[style].zIndex = 500` },

		// Assertions read a value, they don't set one
		{ code: `expect(el).toHaveStyle({ zIndex: 700 })` },
		{ code: `expect(el).not.toHaveStyle({ zIndex: 700 })` },
		{ code: `expect(styles).toEqual({ menu: { zIndex: 700 } })` },
		{ code: `expect(styles).toEqual(expect.objectContaining({ zIndex: 700 }))` },
		{ code: `expect(fn).toHaveBeenCalledWith({ zIndex: 700 })` },

		// Getters and methods compute a value we can't know
		{ code: `const styles = { get zIndex() { return 500 } }` },
		{ code: `const styles = { zIndex() { return 500 } }` },

		// Shadowing: the nearest binding wins
		{ code: `const Z = 500; function f(Z) { return css({ zIndex: Z }) }` },
		{ code: `const Z = 500; function f() { const Z = 1; return css({ zIndex: Z }) }` },

		// Not a `const`, or not a plain binding
		{ code: `var Z = 500; const styles = css({ zIndex: Z })` },
		{ code: `const { Z } = { Z: 500 }; const styles = css({ zIndex: Z })` },
		{ code: `const [Z] = [500]; const styles = css({ zIndex: Z })` },

		// Spread arguments to setProperty can't be read
		{ code: `element.style.setProperty(...args)` },
		{ code: `element.style.setProperty('z-index', ...values)` },

		// Not CSS integers
		{ code: `const styles = css({ zIndex: '1e3' })` },
		{ code: `const styles = css({ zIndex: '0x3e8' })` },
		{ code: `const styles = css({ zIndex: '500px' })` },

		// Untagged templates and plain strings are not covered
		{ code: 'const styles = `z-index: 500;`' },
		{ code: `element.style.cssText = 'z-index: 500'` },
		{ code: `element.setAttribute('style', 'z-index: 500')` },
	],
	invalid: [
		// Object styles
		{ code: `const styles = css({ zIndex: 11 })`, errors: [error(11)] },
		{ code: `const styles = css({ zIndex: 500 })`, errors: [error(500)] },
		{ code: `const styles = css({ zIndex: '9999' })`, errors: [error(9999)] },
		{ code: `const styles = css({ zIndex: '9999 !important' })`, errors: [error(9999)] },
		{ code: `const styles = css({ zIndex: +510 })`, errors: [error(510)] },
		{ code: `const styles = css({ zIndex: -(-500) })`, errors: [error(500)] },
		{ code: `const Z = -500; const styles = css({ zIndex: -Z })`, errors: [error(500)] },
		{ code: 'const styles = css({ zIndex: `700` })', errors: [error(700)] },
		{ code: `const styles = css({ 'z-index': 500 })`, errors: [error(500)] },
		{ code: `const styles = css({ 'zIndex': 500 })`, errors: [error(500)] },
		{ code: `const styles = css({ ['zIndex']: 500 })`, errors: [error(500)] },
		{ code: `const styles = css({ '&:hover': { zIndex: 600 } })`, errors: [error(600)] },
		{ code: `const styles = cssMap({ root: { zIndex: 400 } })`, errors: [error(400)] },
		{ code: `const styles = xcss({ zIndex: 300 })`, errors: [error(300)] },
		{ code: `const Box = styled.div({ zIndex: 200 })`, errors: [error(200)] },
		{ code: `const styles = { zIndex: 9999 }`, errors: [error(9999)] },
		{
			code: `const selectStyles = { menuPortal: (base) => ({ ...base, zIndex: 9999 }) }`,
			errors: [error(9999)],
		},
		{
			code: `const styles = css({ zIndex: 500, top: 0, '&:focus': { zIndex: 501 } })`,
			errors: [error(500), error(501)],
		},

		// Conditionals
		{ code: `const styles = css({ zIndex: isOpen ? 1000 : 1 })`, errors: [error(1000)] },
		{
			code: `const styles = css({ zIndex: isOpen ? 1000 : 2000 })`,
			errors: [error(1000), error(2000)],
		},

		// Same-file constants
		{ code: `const Z = 510; const styles = css({ zIndex: Z })`, errors: [error(510)] },
		{ code: `const Z = '510'; const styles = css({ zIndex: Z })`, errors: [error(510)] },
		{
			code: `const A = 510; const B = A; const styles = css({ zIndex: B })`,
			errors: [error(510)],
		},

		// Inline styles and props
		{ code: `const el = <div style={{ zIndex: 999 }} />`, errors: [error(999)] },
		{ code: `const el = <Portal zIndex={700} />`, errors: [error(700)] },
		{ code: `const el = <Portal zIndex="700" />`, errors: [error(700)] },
		{ code: `const Z = 800; const el = <Blanket zIndex={Z} />`, errors: [error(800)] },

		// DOM writes
		{ code: `element.style.zIndex = '2147483647'`, errors: [error(2147483647)] },
		{ code: `element.style.zIndex = 500`, errors: [error(500)] },
		{ code: `element.style['zIndex'] = 500`, errors: [error(500)] },
		{ code: `element.style.setProperty('z-index', '9999')`, errors: [error(9999)] },
		{
			code: `element.style.setProperty('z-index', '9999', 'important')`,
			errors: [error(9999)],
		},

		// Tagged templates
		{ code: `const styles = css\`z-index: 500;\``, errors: [error(500)] },
		{ code: `const styles = css\`z-index:500\``, errors: [error(500)] },
		{ code: `const styles = css\`z-index: 500 !important;\``, errors: [error(500)] },
		{
			code: `const Box = styled.div\`
				color: red;
				z-index: 9999;
			\``,
			errors: [error(9999)],
		},
		{
			code: `const Box = styled.div\`&:hover { z-index: 600 }\``,
			errors: [error(600)],
		},
		{
			code: `const Global = createGlobalStyle\`.overlay { z-index: 1000; } .badge { z-index: 2; }\``,
			errors: [error(1000)],
		},
		{
			code: `const Box = styled.div\`z-index: 500; top: \${top}px; z-index: 600;\``,
			errors: [error(500), error(600)],
		},
		{
			code: `const Z = 510; const styles = css\`z-index: \${Z};\``,
			errors: [error(510)],
		},
		{
			code: `const styles = css\`z-index: \${isOpen ? 700 : 1};\``,
			errors: [error(700)],
		},

		// Logical expressions
		{
			code: `const el = <Iframe zIndex={requestOptions.zIndex ?? 1000} />`,
			errors: [error(1000)],
		},
		{
			code: `const styles = { zIndex: this.options.iframeZIndex || 200 }`,
			errors: [error(200)],
		},
		{ code: `const styles = css({ zIndex: isOpen && 500 })`, errors: [error(500)] },
		{
			code: `const styles = css({ zIndex: 600 ?? 700 })`,
			errors: [error(600), error(700)],
		},

		// calc(infinity)
		{ code: `const styles = css({ zIndex: 'calc(infinity)' })`, errors: [error('calc(infinity)')] },
		{
			code: `const styles = css({ zIndex: 'CALC( Infinity ) !important' })`,
			errors: [error('calc(infinity)')],
		},
		{
			code: `element.style.zIndex = 'calc(infinity)'`,
			errors: [error('calc(infinity)')],
		},
		{
			code: `const styles = css\`z-index: calc(infinity);\``,
			errors: [error('calc(infinity)')],
		},

		// Assignments to `<something>.style`
		{ code: `this.element.style.zIndex = 500`, errors: [error(500)] },
		{ code: `document.body.style.zIndex = '600'`, errors: [error(600)] },
		{ code: `element['style'].zIndex = 500`, errors: [error(500)] },
		{ code: 'element.style[`zIndex`] = 500', errors: [error(500)] },

		// Only assertions are skipped, not other calls
		{ code: `render({ zIndex: 700 })`, errors: [error(700)] },
		{
			code: `const styles = css({ zIndex: 700 }); expect(styles).toBeDefined()`,
			errors: [error(700)],
		},

		// Shadowing: the nearest binding wins
		{
			code: `const Z = 1; function f() { const Z = 500; return css({ zIndex: Z }) }`,
			errors: [error(500)],
		},

		// Chains of constants
		{ code: `const Z = 999, Y = Z; const styles = css({ zIndex: Y })`, errors: [error(999)] },

		// Spread objects
		{ code: `const styles = css({ ...{ zIndex: 500 } })`, errors: [error(500)] },

		// Template literal keys and names with no expressions
		{ code: 'const styles = css({ [`zIndex`]: 500 })', errors: [error(500)] },
		{ code: 'element.style.setProperty(`z-index`, 500)', errors: [error(500)] },

		// Number formats: these are JavaScript numbers, not CSS strings
		{ code: `const styles = css({ zIndex: 1e3 })`, errors: [error(1000)] },
		{ code: `const styles = css({ zIndex: 0x3e8 })`, errors: [error(1000)] },
		{ code: `const styles = css({ zIndex: ' 500 ' })`, errors: [error(500)] },

		// Tagged templates: case, nesting and location
		{ code: `const styles = css\`Z-INDEX: 500;\``, errors: [error(500)] },
		{
			code: `const styles = css\`\${css\`z-index: 500;\`}\``,
			errors: [error(500)],
		},
		{
			code: `const styles = css\`z-index: 500;\``,
			errors: [{ ...error(500), line: 1, column: 20, endLine: 1, endColumn: 32 }],
		},
		{
			code: `const Box = styled.div\`color: \${color}; z-index: 600 !important;\``,
			errors: [{ ...error(600), line: 1, column: 41, endLine: 1, endColumn: 64 }],
		},
		{
			code: `const Box = styled.div\`
				color: red;
				z-index: 9999;
			\``,
			errors: [{ ...error(9999), line: 3, column: 5, endLine: 3, endColumn: 18 }],
		},
	],
});

typescriptEslintTester.run(
	'no-global-z-index',
	// @ts-expect-error
	rule,
	{
		valid: [
			{ code: `const Z = 2 as const; const styles = css({ zIndex: Z })` },
			{ code: `const styles = css({ zIndex: 5 as number })` },
			{
				code: `const styles = css({ zIndex: <number>5 })`,
				parserOptions: { ecmaFeatures: { jsx: false } },
			},
		],
		invalid: [
			{
				code: `const Z = 510 as const; const styles = css({ zIndex: Z })`,
				errors: [error(510)],
			},
			{
				code: `const styles = css({ zIndex: 500 satisfies number })`,
				errors: [error(500)],
			},
			{
				code: `const styles = css({ zIndex: (999 as number)! })`,
				errors: [error(999)],
			},
			{
				code: `const styles = css({ zIndex: <number>500 })`,
				parserOptions: { ecmaFeatures: { jsx: false } },
				errors: [error(500)],
			},
			// typescript-estree includes the template delimiters in each quasi's range
			{
				code: `const Box = styled.div\`color: \${color}; z-index: 600 !important;\``,
				errors: [{ ...error(600), line: 1, column: 41, endLine: 1, endColumn: 64 }],
			},
		],
	},
);
