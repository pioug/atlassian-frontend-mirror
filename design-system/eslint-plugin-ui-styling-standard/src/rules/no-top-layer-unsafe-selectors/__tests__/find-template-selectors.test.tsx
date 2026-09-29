/* eslint-disable no-template-curly-in-string -- `${…}` is the subject under test here: these
   strings stand in for the raw source of a tagged template, where an interpolation is exactly
   what the scanner must locate and the transform must refuse. Interpolating them for real would
   test the wrong thing. */
import { findTemplateSelectors } from '../find-template-selectors';

/**
 * `offset` is 0 throughout so `start` / `end` read as indices into the input string.
 */
function scan(source: string) {
	return findTemplateSelectors(source, 0).map(({ text, start, end }) => ({
		text,
		slice: source.slice(start, end),
	}));
}

describe('findTemplateSelectors', () => {
	it('finds a single selector', () => {
		expect(scan('\n  & > div {\n    color: red;\n  }\n')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('returns ranges that slice back to exactly the selector text', () => {
		const source = '\n  color: blue;\n  & > *:first-child {\n    color: red;\n  }\n';

		for (const found of scan(source)) {
			expect(found.slice).toBe(found.text);
		}
	});

	it('finds a selector after a declaration', () => {
		expect(scan('color: blue; & > div { color: red; }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('finds nested selectors', () => {
		expect(scan('& > div { & > span { color: red; } }')).toEqual([
			{ text: '& > div', slice: '& > div' },
			{ text: '& > span', slice: '& > span' },
		]);
	});

	it('skips at-rules but not the selectors inside them', () => {
		expect(scan('@media (min-width: 100px) { & > div { color: red; } }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('does not treat a brace inside a quoted value as a block', () => {
		expect(scan('content: "{"; & > div { color: red; }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('does not treat a brace inside a comment as a block, and drops the comment', () => {
		expect(scan('/* { not css } */ & > div { color: red; }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('skips a selector with a comment inside it rather than mangling the range', () => {
		expect(scan('& /* keep me */ > div { color: red; }')).toEqual([]);
	});

	it('drops a leading // line comment, including one with an apostrophe in it', () => {
		expect(scan("// don't touch this\n& > div { color: red; }")).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('drops a // line comment between declarations', () => {
		expect(scan('color: blue; // why\n& > div { color: red; }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('skips a selector with a // comment inside it rather than mangling the range', () => {
		expect(scan('& // keep me\n> div { color: red; }')).toEqual([]);
	});

	it('does not treat the // of an unquoted url() as a comment', () => {
		expect(scan('background: url(https://x.test/a.png); & > div { color: red; }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('does not treat the // of a protocol-relative url() as a comment', () => {
		expect(scan('background: url(//cdn.x.test/a.png); & > div { color: red; }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('does not treat a // inside an unquoted data URI as a comment', () => {
		expect(
			scan('background: url(data:image/svg+xml,%3Csvg xmlns=//w3.org%3E); & > div { color: red; }'),
		).toEqual([{ text: '& > div', slice: '& > div' }]);
	});

	it('still drops a // comment that follows a closed parenthesis', () => {
		expect(scan('color: rgb(1, 2, 3); // why\n& > div { color: red; }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('drops a leading comment on a nested selector too', () => {
		expect(scan('& > div { /* why */ & > span { color: red; } }')).toEqual([
			{ text: '& > div', slice: '& > div' },
			{ text: '& > span', slice: '& > span' },
		]);
	});

	it('steps over a ${…} interpolation and keeps it in the selector text', () => {
		expect(scan('& > ${Child} { color: red; }')).toEqual([
			{ text: '& > ${Child}', slice: '& > ${Child}' },
		]);
	});

	it('does not let an interpolation’s braces open a block', () => {
		expect(scan('${mixin({ a: 1 })} & > div { color: red; }')).toEqual([
			{ text: '${mixin({ a: 1 })} & > div', slice: '${mixin({ a: 1 })} & > div' },
		]);
	});

	it('does not let a brace inside an interpolation’s string literal end the interpolation', () => {
		expect(scan("color: ${(p) => (p.x ? '}' : '')}; & > div { color: red; }")).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
		expect(scan('color: ${(p) => (p.x ? "}" : "")}; & > div { color: red; }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('steps over a template literal inside an interpolation, including its own interpolations', () => {
		const source = '${cond && css`a { b: ${c({ d: 1 })}; }`} & > div { color: red; }';

		expect(scan(source)).toEqual([
			{
				text: '${cond && css`a { b: ${c({ d: 1 })}; }`} & > div',
				slice: '${cond && css`a { b: ${c({ d: 1 })}; }`} & > div',
			},
		]);
	});

	it('returns nothing for a declaration-only template', () => {
		expect(scan('color: red; display: block;')).toEqual([]);
	});

	it('returns nothing for an empty template', () => {
		expect(scan('')).toEqual([]);
	});

	it('applies the offset to every range', () => {
		const found = findTemplateSelectors('& > div { color: red; }', 100);

		expect(found).toHaveLength(1);
		expect(found[0].start).toBe(100);
		expect(found[0].end).toBe(107);
	});

	it('tolerates an unterminated block without looping', () => {
		expect(scan('& > div { color: red;')).toEqual([{ text: '& > div', slice: '& > div' }]);
	});

	it('tolerates an unterminated quote without looping', () => {
		expect(scan('content: "abc')).toEqual([]);
	});

	it('tolerates an unterminated interpolation without looping', () => {
		expect(scan('& > ${Child')).toEqual([]);
	});

	/**
	 * The at-rule's own prelude was already skipped, but its block opened a fresh segment, so the
	 * offsets inside came back as selectors. Each parses as a tag selector, so the rule guarded
	 * them and the animation stopped.
	 */
	it('finds no selectors inside a @keyframes block', () => {
		expect(scan('@keyframes spin { from { opacity: 0; } to { opacity: 1; } }')).toEqual([]);
		expect(scan('@-webkit-keyframes spin { 0% { opacity: 0; } 100% { opacity: 1; } }')).toEqual([]);
	});

	it('resumes finding selectors after a @keyframes block closes', () => {
		expect(scan('@keyframes spin { from { opacity: 0; } } & > div { color: red; }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('still finds selectors nested in other at-rules', () => {
		expect(scan('@media screen { & > div { color: red; } }')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});
});

describe('a mixin alone on its line', () => {
	it('does not swallow the selector on the next line when it has no semicolon', () => {
		expect(scan('\n  ${mixin}\n  & > div { color: red; }\n')).toEqual([
			{ text: '& > div', slice: '& > div' },
		]);
	});

	it('still keeps an interpolated selector whole', () => {
		expect(scan('\n  ${Button} > div { color: red; }\n')).toEqual([
			{ text: '${Button} > div', slice: '${Button} > div' },
		]);
	});
});
