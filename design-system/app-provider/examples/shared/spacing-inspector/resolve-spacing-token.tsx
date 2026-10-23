type SpacingProperty =
	| 'row-gap'
	| 'column-gap'
	| 'padding-top'
	| 'padding-right'
	| 'padding-bottom'
	| 'padding-left';

type Declaration = {
	selector: string;
	style: CSSStyleDeclaration;
	order: number;
	uncertain: boolean;
};

type StylesheetIndex = {
	declarations: Record<'gap' | 'padding', Declaration[]>;
	inaccessible: boolean;
};

/**
 * Split a spacing shorthand without splitting whitespace inside var() or calc().
 */
function splitSpacing(value: string): string[] {
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

function readDeclaration(style: CSSStyleDeclaration, property: SpacingProperty, direction: string) {
	const isPadding = property.startsWith('padding-');
	const side = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'].indexOf(property);
	const inlineStart = direction === 'rtl' ? 'padding-right' : 'padding-left';
	const inlineEnd = direction === 'rtl' ? 'padding-left' : 'padding-right';
	const logicalSides: Record<string, string[]> = {
		'padding-block': ['padding-top', 'padding-bottom'],
		'padding-inline': [inlineStart, inlineEnd],
		'padding-block-start': ['padding-top'],
		'padding-block-end': ['padding-bottom'],
		'padding-inline-start': [inlineStart],
		'padding-inline-end': [inlineEnd],
	};
	let winner: { value: string; important: boolean } | null = null;
	for (let i = 0; i < style.length; i++) {
		const declared = style[i];
		const logicalIndex = isPadding ? (logicalSides[declared]?.indexOf(property) ?? -1) : -1;
		if (![property, isPadding ? 'padding' : 'gap', 'all'].includes(declared) && logicalIndex < 0) {
			continue;
		}
		const important = style.getPropertyPriority(declared) === 'important';
		if (winner?.important && !important) {
			continue;
		}
		const raw = style.getPropertyValue(declared);
		// Browsers expand padding into four longhands, but leave their values empty when
		// the shorthand contains var(). The authored reference remains on the shorthand.
		const paddingShorthand =
			isPadding && declared === property && !raw ? style.getPropertyValue('padding') : '';
		const values = splitSpacing(paddingShorthand || raw);
		let value = values[0] ?? '';
		if (declared === 'padding' || paddingShorthand) {
			value =
				[
					values[0],
					values[1] ?? values[0],
					values[2] ?? values[0],
					values[3] ?? values[1] ?? values[0],
				][side] ?? '';
		} else if ((declared === 'gap' && property === 'column-gap') || logicalIndex === 1) {
			value = values[1] ?? value;
		}
		winner = { value, important };
	}
	return winner;
}

/**
 * Index gap and padding declarations. Unknown grouping rules (layers, containers, imports) remain
 * conservative candidates rather than silently being treated as ordinary unlayered rules.
 */
export function indexSpacingStyles(document: Document): StylesheetIndex {
	const index: StylesheetIndex = {
		declarations: { gap: [], padding: [] },
		// Constructed stylesheets need separate cascade handling; retain unknown identities for now.
		inaccessible: Boolean(document.adoptedStyleSheets?.length),
	};
	let order = 0;
	const visit = (rules: CSSRuleList, uncertain = false) => {
		for (const rule of Array.from(rules)) {
			if (rule.type === CSSRule.STYLE_RULE) {
				const { selectorText, style } = rule as CSSStyleRule;
				const properties = Array.from({ length: style.length }, (_, i) => style[i]);
				for (const family of ['gap', 'padding'] as const) {
					if (
						properties.some(
							(property) =>
								property === 'all' ||
								(family === 'gap'
									? ['gap', 'row-gap', 'column-gap'].includes(property)
									: property === 'padding' || property.startsWith('padding-')),
						)
					) {
						index.declarations[family].push({
							selector: selectorText,
							style,
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

export function resolveSpacingToken(
	element: HTMLElement,
	property: SpacingProperty,
	index: StylesheetIndex,
): string | null {
	if (index.inaccessible) {
		return null;
	}
	let winner: { value: string; important: boolean; specificity: number; order: number } | null =
		null;
	const computed = getComputedStyle(element);
	const family = property.startsWith('padding-') ? 'padding' : 'gap';
	for (const declaration of index.declarations[family]) {
		const value = readDeclaration(declaration.style, property, computed.direction);
		if (!value) {
			continue;
		}
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
				Number(value.important) > Number(winner.important) ||
				(value.important === winner.important &&
					(weight > winner.specificity ||
						(weight === winner.specificity && declaration.order > winner.order)))
			) {
				winner = { ...value, order: declaration.order, specificity: weight };
			}
		}
	}
	const inline = readDeclaration(element.style, property, computed.direction);
	if (inline && (!winner || inline.important || !winner.important)) {
		winner = { ...inline, specificity: 1000000, order: 0 };
	}
	// Animations/transitions can replace the matched declaration with a different value.
	if (computed.animationName && computed.animationName !== 'none') {
		return null;
	}
	if (
		computed.transitionProperty
			.split(',')
			.some(
				(transition) =>
					['all', family, property].includes(transition.trim()) ||
					(family === 'padding' && transition.trim().startsWith('padding-')),
			) &&
		(computed.transitionDuration || '').split(',').some((duration) => parseFloat(duration) > 0)
	) {
		return null;
	}
	const name = winner?.value.match(
		/^var\(\s*--ds-space-((?:gap|inset)-[a-z]+|(?:negative-)?\d+)\s*(?:,[\s\S]*)?\)$/,
	)?.[1];
	return name ? `space.${name.replace(/-/g, '.')}` : null;
}
