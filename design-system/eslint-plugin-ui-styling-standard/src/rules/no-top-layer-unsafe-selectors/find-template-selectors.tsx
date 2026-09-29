/**
 * Locate the selectors inside a tagged template literal's raw source text.
 *
 * The style-call index only sees call expressions, so `styled.div\`…\`` and `css\`…\`` are
 * invisible to it. This scanner fills that gap: it walks the text between the template's
 * backticks and returns the byte range of every selector, so ranges map 1:1 onto the file and
 * can be handed straight to an ESLint fixer.
 *
 * It deliberately does not try to be a CSS parser. A selector is the text between the last
 * `;`, `{` or `}` and the next `{`. Anything it mis-reads will either fail to parse as a
 * selector — in which case `rewriteSelector` skips it — or be reported for review. What it
 * must not do is mistake a `${…}` interpolation, a quoted string or a comment for CSS
 * structure, so it steps over all three.
 */
export type TemplateSelector = {
	/**
	 * The selector text, trimmed. Retains any `${…}` so the transform can skip it.
	 */
	text: string;
	/**
	 * Absolute start offset of `text` in the file.
	 */
	start: number;
	/**
	 * Absolute end offset of `text` in the file.
	 */
	end: number;
};

export function findTemplateSelectors(source: string, offset: number): TemplateSelector[] {
	const found: TemplateSelector[] = [];
	let segmentStart = 0;
	/**
	 * Set when a comment appears after the segment's first non-whitespace character. A selector
	 * with a comment inside it — `& /* x *​/ > div` — cannot be replaced as one contiguous range
	 * without eating the comment, so it is skipped rather than mangled. A comment *before* the
	 * selector just moves `segmentStart` past it.
	 */
	let commentInsideSegment = false;
	/**
	 * How many `(` are open. Inside a function's parentheses `//` is data, not a comment:
	 * `url(//cdn.example.com/a.png)` and an unquoted data URI both carry one.
	 */
	let parenthesisDepth = 0;
	/**
	 * How many CSS `{` are open. `${…}` braces and parentheses do not count.
	 */
	let braceDepth = 0;
	/**
	 * The brace depth at which a `@keyframes` block opened, or `null` outside one. Everything
	 * nested inside is an offset (`from`, `50%`), not a selector — each parses as a tag selector,
	 * so without this the guard is written onto a keyframe and the animation stops. Skipping the
	 * at-rule's own prelude is not enough, because the block's contents open their own segments.
	 */
	let keyframesDepth: number | null = null;

	const startSegment = (at: number): void => {
		segmentStart = at;
		commentInsideSegment = false;
	};

	/**
	 * Step over a comment spanning `[start, end)`. A comment before the segment's first
	 * non-whitespace character just moves the segment past it; a comment inside the segment
	 * marks it unfixable. Returns the index to resume scanning at.
	 */
	const skipComment = (start: number, end: number): number => {
		const isLeading = source.slice(segmentStart, start).trim() === '';
		if (isLeading) {
			segmentStart = end;
		} else {
			commentInsideSegment = true;
		}
		return end;
	};

	for (let index = 0; index < source.length; index++) {
		const character = source[index];

		/* Step over a quoted string — `content: "{"` must not open a block. */
		if (character === '"' || character === "'") {
			index = skipQuoted(source, index);
			continue;
		}

		if (character === '/' && source[index + 1] === '*') {
			const close = source.indexOf('*/', index + 2);
			const end = close === -1 ? source.length : close + 2;
			index = skipComment(index, end) - 1;
			continue;
		}

		/**
		 * A `//` line comment. Emotion and styled-components strip these before the CSS is
		 * parsed, so a selector written after one on the next line is real. Inside parentheses
		 * the same two characters are part of a URL, so the depth check keeps them.
		 */
		if (character === '/' && source[index + 1] === '/' && parenthesisDepth === 0) {
			const newline = source.indexOf('\n', index + 2);
			const end = newline === -1 ? source.length : newline + 1;
			index = skipComment(index, end) - 1;
			continue;
		}

		if (character === '(') {
			parenthesisDepth++;
			continue;
		}
		if (character === ')') {
			parenthesisDepth = Math.max(0, parenthesisDepth - 1);
			continue;
		}

		/* Step over a `${…}` interpolation. Its braces are not CSS braces, but the `${…}` text
		 * itself stays in the segment so the transform can recognise the selector as dynamic. */
		if (character === '{' && index > 0 && source[index - 1] === '$') {
			const isLeading = source.slice(segmentStart, index - 1).trim() === '';
			index = skipInterpolation(source, index);
			/**
			 * A `${mixin}` alone on its line, with no `;` after it, is a statement of its own:
			 * the selector on the next line starts a fresh segment rather than inheriting the
			 * interpolation and being read as dynamic.
			 */
			if (isLeading && isRestOfLineBlank(source, index + 1)) {
				startSegment(index + 1);
			}
			continue;
		}

		if (character === '{') {
			const raw = source.slice(segmentStart, index);
			const leading = raw.length - raw.trimStart().length;
			const text = raw.trim();

			/* At-rules are blocks but not selectors; the transform has nothing to say about them. */
			if (
				text !== '' &&
				!text.startsWith('@') &&
				!commentInsideSegment &&
				keyframesDepth === null
			) {
				found.push({
					text,
					start: offset + segmentStart + leading,
					end: offset + segmentStart + leading + text.length,
				});
			}

			if (keyframesDepth === null && /^@(-[a-z]+-)?keyframes\b/i.test(text)) {
				keyframesDepth = braceDepth;
			}
			braceDepth++;

			startSegment(index + 1);
			continue;
		}

		if (character === '}') {
			braceDepth = Math.max(0, braceDepth - 1);
			if (keyframesDepth !== null && braceDepth <= keyframesDepth) {
				keyframesDepth = null;
			}
		}

		if (character === '}' || character === ';') {
			startSegment(index + 1);
		}
	}

	return found;
}

/**
 * Is everything from `start` to the next newline whitespace? A missing newline does not count:
 * `${selector}` at the very end has nothing after it to separate from.
 */
function isRestOfLineBlank(source: string, start: number): boolean {
	const newline = source.indexOf('\n', start);
	return newline !== -1 && source.slice(start, newline).trim() === '';
}

/**
 * Index of the quote closing the string that opens at `start`, or the end of the source when
 * the string is unterminated.
 */
function skipQuoted(source: string, start: number): number {
	const quote = source[start];
	let index = start + 1;

	while (index < source.length) {
		if (source[index] === '\\') {
			index += 2;
			continue;
		}
		if (source[index] === quote) {
			return index;
		}
		index++;
	}

	return source.length;
}

/**
 * Index of the `}` closing the interpolation whose `{` is at `start`, or the end of the source
 * when it is unterminated.
 *
 * The interpolation holds JavaScript, so a brace inside one of its string literals is not a
 * brace: `${cond ? '}' : ''}` closes at the last character, not at the quoted one. Quoted
 * strings and template literals are stepped over; a template literal may in turn hold its own
 * interpolations, so the two skips call each other.
 */
function skipInterpolation(source: string, start: number): number {
	let depth = 1;
	let index = start + 1;

	while (index < source.length && depth > 0) {
		const character = source[index];

		if (character === '"' || character === "'") {
			index = skipQuoted(source, index) + 1;
			continue;
		}
		if (character === '`') {
			index = skipTemplateLiteral(source, index) + 1;
			continue;
		}
		if (character === '{') {
			depth++;
		} else if (character === '}') {
			depth--;
		}
		index++;
	}

	return index - 1;
}

/**
 * Index of the backtick closing the template literal that opens at `start`, or the end of the
 * source when it is unterminated.
 */
function skipTemplateLiteral(source: string, start: number): number {
	let index = start + 1;

	while (index < source.length) {
		if (source[index] === '\\') {
			index += 2;
			continue;
		}
		if (source[index] === '`') {
			return index;
		}
		if (source[index] === '$' && source[index + 1] === '{') {
			index = skipInterpolation(source, index + 1) + 1;
			continue;
		}
		index++;
	}

	return source.length;
}
