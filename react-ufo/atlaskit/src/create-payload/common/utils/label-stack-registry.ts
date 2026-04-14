/**
 * LabelStackRegistry provides a lookup table for deduplicating labelStack strings
 * across payload sections (spans, holdInfo, requestInfo, etc.).
 *
 * Instead of repeating the same labelStack string in every entry, each unique string
 * is assigned a numeric index. The lookup table maps index → string, and payload
 * entries reference the index.
 *
 * This is only used for v2.0.0 payloads (page_load/transition) where labelStacks
 * are serialized as slash-separated strings.
 */
export class LabelStackRegistry {
	private lookupMap = new Map<string, number>();
	private nextIndex = 0;

	/**
	 * Registers a labelStack string and returns its numeric index.
	 * If the string has already been registered, returns the existing index.
	 */
	register(labelStack: string): number {
		const existing = this.lookupMap.get(labelStack);
		if (existing !== undefined) {
			return existing;
		}
		const index = this.nextIndex++;
		this.lookupMap.set(labelStack, index);
		return index;
	}

	/**
	 * Returns the lookup table as a Record<string, string> mapping
	 * stringified index → labelStack string.
	 * This is included in the payload as `_ls`.
	 */
	getLookupTable(): Record<string, string> {
		const table: Record<string, string> = {};
		for (const [labelStack, index] of this.lookupMap) {
			table[String(index)] = labelStack;
		}
		return table;
	}

	/**
	 * Returns the number of unique labelStack strings registered.
	 */
	get size(): number {
		return this.lookupMap.size;
	}
}
