export type LabelStackTrieNode = {
	/** label segment */
	l: string;
	/** parent trie node index, or -1 for root */
	p: number;
};

export type LabelStackTrieLookupTable = {
	v: 2;
	n: LabelStackTrieNode[];
};

/**
 * LabelStackRegistry provides a lookup table for deduplicating labelStack strings
 * across payload sections (spans, holdInfo, requestInfo, etc.).
 *
 * Instead of repeating the same labelStack string in every entry, every slash-separated
 * part is stored in a trie. Payload entries reference the terminal trie node id, and
 * consumers can reconstruct the full labelStack by walking parent pointers.
 *
 * This is only used for v2.0.0 payloads (page_load/transition) where labelStacks
 * are serialized as slash-separated strings.
 */
export class LabelStackRegistry {
	private nodes: LabelStackTrieNode[] = [];
	private childLookupMap = new Map<string, number>();
	private terminalLookupMap = new Map<string, number>();

	/**
	 * Registers a labelStack string and returns its terminal trie node id.
	 * If the string has already been registered, returns the existing node id.
	 */
	register(labelStack: string): number {
		const existing = this.terminalLookupMap.get(labelStack);
		if (existing !== undefined) {
			return existing;
		}

		let parent = -1;
		const labels = labelStack === '' ? [''] : labelStack.split('/');

		for (const label of labels) {
			const childLookupKey = `${parent}\u0000${label}`;
			const existingChild = this.childLookupMap.get(childLookupKey);

			if (existingChild !== undefined) {
				parent = existingChild;
			} else {
				const index = this.nodes.length;
				this.nodes.push({ l: label, p: parent });
				this.childLookupMap.set(childLookupKey, index);
				parent = index;
			}
		}

		this.terminalLookupMap.set(labelStack, parent);
		return parent;
	}

	/**
	 * Returns the lookup table as a versioned trie included in the payload as `_ls`.
	 */
	getLookupTable(): LabelStackTrieLookupTable {
		return {
			v: 2,
			n: this.nodes,
		};
	}

	/**
	 * Returns the number of unique labelStack strings registered.
	 */
	get size(): number {
		return this.terminalLookupMap.size;
	}
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function resolveLabelStackFromTrie(
	lookupTable: LabelStackTrieLookupTable,
	labelStackRef: number,
): string {
	const labels: string[] = [];
	let currentIndex = labelStackRef;

	while (currentIndex !== -1) {
		const node = lookupTable.n[currentIndex];

		if (!node) {
			return '';
		}

		labels.push(node.l);
		currentIndex = node.p;
	}

	return labels.reverse().join('/');
}
