type Options = {
	allowedPseudos?: ReadonlySet<string>;
	allowBareNesting?: boolean;
	allowLeadingPseudo?: boolean;
};

/**
 * Recognizes simple, parseable selector lists made only from nesting and non-functional pseudos.
 * Returning false means the caller must use the full selector parser.
 */
export function isSimpleSelector(selectorText: string, options: Options = {}): boolean {
	let index = 0;

	while (index < selectorText.length) {
		index = skipWhitespace(selectorText, index);
		const hasNesting = selectorText.charCodeAt(index) === 38;
		if (hasNesting) {
			index++;
			if (selectorText.charCodeAt(index) === 38) {
				return false;
			}
		} else if (!options.allowLeadingPseudo || selectorText.charCodeAt(index) !== 58) {
			return false;
		}

		let pseudoCount = 0;
		while (selectorText.charCodeAt(index) === 58) {
			const pseudoStart = index++;
			if (selectorText.charCodeAt(index) === 58) {
				index++;
			}

			const nameStart = index;
			while (index < selectorText.length && isPseudoNameCharacter(selectorText.charCodeAt(index))) {
				index++;
			}

			if (index === nameStart || selectorText.charCodeAt(index) === 40) {
				return false;
			}

			if (
				options.allowedPseudos &&
				!options.allowedPseudos.has(selectorText.slice(pseudoStart, index))
			) {
				return false;
			}
			pseudoCount++;
		}

		if (pseudoCount === 0 && (!hasNesting || !options.allowBareNesting)) {
			return false;
		}

		index = skipWhitespace(selectorText, index);
		if (index === selectorText.length) {
			return true;
		}
		if (selectorText.charCodeAt(index) !== 44) {
			return false;
		}
		index++;
	}

	return false;
}

function skipWhitespace(value: string, start: number): number {
	let index = start;
	while (index < value.length) {
		const character = value.charCodeAt(index);
		if (character !== 32 && (character < 9 || character > 13)) {
			break;
		}
		index++;
	}
	return index;
}

function isPseudoNameCharacter(character: number): boolean {
	return (
		character === 45 ||
		character === 95 ||
		(character >= 48 && character <= 57) ||
		(character >= 65 && character <= 90) ||
		(character >= 97 && character <= 122)
	);
}
