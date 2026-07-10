/**
 * Configurable thresholds for the `smart` diffType.
 *
 * See docs/smart-diff-design.md §3 and §6 for the exact semantics of each level.
 */
export type SmartDiffThresholds = {
	/**
	 * Node/container level. Unit = direct children.
	 * - `ratio`: promote to node-level when
	 *   `changedChildren / max(childrenOld, childrenNew) >= ratio`.
	 * - `textBearingRatio`: alternatively promote when the fraction of text-bearing
	 *   children (paragraph/heading) that were themselves promoted to paragraph-level
	 *   is `>= textBearingRatio`.
	 */
	node: { ratio: number; textBearingRatio: number };
	/**
	 * Paragraph/textblock level. Unit = sentences.
	 * Promote when `sentencesChanged >= minChanged` AND
	 * `sentencesChanged / max(sentencesOld, sentencesNew) >= ratio`.
	 */
	paragraph: { minChanged: number; ratio: number };
	/**
	 * Sentence level. Unit = words (inline non-text nodes count as one word).
	 * Promote when `wordsChanged >= minChanged` AND
	 * `wordsChanged / max(wordsOld, wordsNew) >= ratio`.
	 */
	sentence: { minChanged: number; ratio: number };
};

export const DEFAULT_SMART_THRESHOLDS: SmartDiffThresholds = {
	sentence: { ratio: 0.4, minChanged: 2 },
	paragraph: { ratio: 0.4, minChanged: 2 },
	node: { ratio: 0.6, textBearingRatio: 0.6 },
};

/**
 * Merge caller overrides onto the defaults. Overrides are shallow-merged per level so a
 * caller can tune a single field (e.g. only `sentence.ratio`) without re-specifying the
 * rest.
 */
export const resolveThresholds = (
	overrides?: Partial<SmartDiffThresholds>,
): SmartDiffThresholds => {
	if (!overrides) {
		return DEFAULT_SMART_THRESHOLDS;
	}
	return {
		sentence: { ...DEFAULT_SMART_THRESHOLDS.sentence, ...overrides.sentence },
		paragraph: { ...DEFAULT_SMART_THRESHOLDS.paragraph, ...overrides.paragraph },
		node: { ...DEFAULT_SMART_THRESHOLDS.node, ...overrides.node },
	};
};
