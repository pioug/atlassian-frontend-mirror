type Axis = 'row-gap' | 'column-gap';

type Declaration = {
	selector: string;
	value: string;
	important: boolean;
	order: number;
	uncertain: boolean;
};

type StylesheetIndex = {
	declarations: Record<Axis, Declaration[]>;
	inaccessible: boolean;
};

/**
 * Split a gap shorthand without splitting whitespace inside var() or calc().
 */
function splitGap(value: string): string[] {
	const values: string[] = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < value.length; i++) {
		if (value[i] === '(') depth++;
		if (value[i] === ')') depth--;
		if (depth < 0) return [];
		if (/\s/.test(value[i]) && depth === 0) {
			if (i > start) values.push(value.slice(start, i));
			start = i + 1;
		}
	}
	if (depth !== 0) return [];
	if (start < value.length) values.push(value.slice(start));
	return values;
}

function readDeclaration(style: CSSStyleDeclaration, axis: Axis) {
	let winner: { value: string; important: boolean } | null = null;
	for (let i = 0; i < style.length; i++) {
		const property = style[i];
		if (![axis, 'gap', 'all'].includes(property)) {
			continue;
		}
		const important = style.getPropertyPriority(property) === 'important';
		if (winner?.important && !important) {
			continue;
		}
		const raw = style.getPropertyValue(property);
		const values = property === 'gap' ? splitGap(raw) : [raw];
		winner = {
			value: values[property === 'gap' && axis === 'column-gap' ? 1 : 0] ?? values[0] ?? '',
			important,
		};
	}
	return winner;
}

/**
 * Index only gap declarations. Unknown grouping rules (layers, containers, imports) remain
 * conservative candidates rather than silently being treated as ordinary unlayered rules.
 */
export function indexGapStyles(document: Document): StylesheetIndex {
	const index: StylesheetIndex = {
		declarations: { 'row-gap': [], 'column-gap': [] },
		// Constructed stylesheets need separate cascade handling; retain unknown identities for now.
		inaccessible: Boolean(document.adoptedStyleSheets?.length),
	};
	let order = 0;
	const visit = (rules: CSSRuleList, uncertain = false) => {
		for (const rule of Array.from(rules)) {
			if (rule.type === CSSRule.STYLE_RULE) {
				const { selectorText, style } = rule as CSSStyleRule;
				for (const axis of ['row-gap', 'column-gap'] as const) {
					const declaration = readDeclaration(style, axis);
					if (declaration) {
						index.declarations[axis].push({
							selector: selectorText,
							...declaration,
							order: order++,
							uncertain,
						});
					}
				}
				if ('cssRules' in rule) {
					visit((rule as CSSStyleRule).cssRules, true);
				}
			} else if (rule.type === CSSRule.MEDIA_RULE) {
				const media = rule as CSSMediaRule;
				if (document.defaultView?.matchMedia(media.conditionText).matches) {
					visit(media.cssRules, uncertain);
				}
			} else if (rule.type === CSSRule.SUPPORTS_RULE) {
				const supports = rule as CSSSupportsRule;
				if (CSS.supports(supports.conditionText)) {
					visit(supports.cssRules, uncertain);
				}
			} else if (rule.type === CSSRule.IMPORT_RULE) {
				try {
					const sheet = (rule as CSSImportRule).styleSheet;
					if (sheet) {
						visit(sheet.cssRules, true);
					}
				} catch {
					index.inaccessible = true;
				}
			} else if ('cssRules' in rule && rule.type !== CSSRule.KEYFRAMES_RULE) {
				visit((rule as CSSGroupingRule).cssRules, true);
			}
		}
	};
	for (const sheet of Array.from(document.styleSheets)) {
		if (
			sheet.disabled ||
			(sheet.media?.mediaText && !document.defaultView?.matchMedia(sheet.media.mediaText).matches)
		) {
			continue;
		}
		try {
			visit(sheet.cssRules);
		} catch {
			// An unreadable stylesheet could contain a winning declaration. Do not guess its token.
			index.inaccessible = true;
		}
	}
	return index;
}

/**
 * Compiled emits simple atomic class selectors. Support compound classes, IDs and element
 * selectors too; complex matching selectors deliberately produce an unknown identity.
 */
function specificity(selector: string): number | null {
	if (!/^(?:[a-z][\w-]*|\*)?(?:[.#][\w-]+)*$/i.test(selector)) {
		return null;
	}
	return (
		(selector.match(/#/g)?.length ?? 0) * 10000 +
		(selector.match(/\./g)?.length ?? 0) * 100 +
		(/^[a-z]/i.test(selector) ? 1 : 0)
	);
}

export function resolveGapToken(
	element: HTMLElement,
	axis: Axis,
	index: StylesheetIndex,
): string | null {
	if (index.inaccessible) {
		return null;
	}
	let winner: { value: string; important: boolean; specificity: number; order: number } | null =
		null;
	for (const declaration of index.declarations[axis]) {
		for (const selector of declaration.selector.split(',')) {
			const trimmed = selector.trim();
			let matches = false;
			try {
				matches = element.matches(trimmed);
			} catch {
				return null;
			}
			if (!matches) {
				continue;
			}
			const weight = specificity(trimmed);
			if (declaration.uncertain || weight === null) {
				return null;
			}
			if (
				!winner ||
				Number(declaration.important) > Number(winner.important) ||
				(declaration.important === winner.important &&
					(weight > winner.specificity ||
						(weight === winner.specificity && declaration.order > winner.order)))
			) {
				winner = { ...declaration, specificity: weight };
			}
		}
	}
	const inline = readDeclaration(element.style, axis);
	if (inline && (!winner || inline.important || !winner.important)) {
		winner = { ...inline, specificity: 1000000, order: 0 };
	}
	// Animations/transitions can replace the matched declaration with a different value.
	const computed = getComputedStyle(element);
	if (computed.animationName && computed.animationName !== 'none') {
		return null;
	}
	if (
		computed.transitionProperty
			.split(',')
			.some((property) => ['all', 'gap', axis].includes(property.trim())) &&
		(computed.transitionDuration || '').split(',').some((duration) => parseFloat(duration) > 0)
	) {
		return null;
	}
	const name = winner?.value.match(
		/^var\(\s*--ds-space-(gap-[a-z]+|(?:negative-)?\d+)\s*(?:,[\s\S]*)?\)$/,
	)?.[1];
	return name ? `space.${name.replace(/-/g, '.')}` : null;
}
