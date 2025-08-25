// Adapted from https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/interactions.ts
import { InteractionCountPolyfill } from './interaction-count-polyfill';

interface PerformanceEventTiming extends PerformanceEntry {
	interactionId?: number;
}

interface Interaction {
	entries: PerformanceEventTiming[];
	id: number;
	latency: number;
}

export class InteractionManager {
	private longestInteractionList: Interaction[];
	private longestInteractionMap: Map<number, Interaction>;
	private interactionCountPolyfill: InteractionCountPolyfill;
	private static readonly MAX_INTERACTIONS_TO_CONSIDER = 10;

	public constructor() {
		this.longestInteractionList = [];
		this.longestInteractionMap = new Map();
		this.interactionCountPolyfill = new InteractionCountPolyfill();
	}

	public cleanup(): void {
		this.interactionCountPolyfill.cleanup();
	}

	/**
	 * Returns the estimated p98 longest interaction based on the stored
	 * interaction candidates and the interaction count for the current page.
	 */
	public estimateP98LongestInteraction(): Interaction | undefined {
		const candidateInteractionIndex = Math.min(
			this.longestInteractionList.length - 1,
			Math.floor(this.interactionCountPolyfill.getInteractionCount() / 50),
		);

		return this.longestInteractionList[candidateInteractionIndex];
	}

	/**
	 * Takes a performance entry and adds it to the list of worst interactions
	 * if its duration is long enough to make it among the worst. If the
	 * entry is part of an existing interaction, it is merged and the latency
	 * and entries list is updated as needed.
	 */
	public processInteractionEntry(entry: PerformanceEventTiming): void {
		// Skip further processing for entries that cannot be INP candidates.
		if (!(entry.interactionId || entry.entryType === 'first-input')) {
			return;
		}

		// The least-long of the 10 longest interactions.
		const minLongestInteraction =
			this.longestInteractionList[this.longestInteractionList.length - 1];

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const existingInteraction = this.longestInteractionMap.get(entry.interactionId!);

		// Only process the entry if it's possibly one of the ten longest,
		// or if it's part of an existing interaction.
		if (
			existingInteraction ||
			this.longestInteractionList.length < InteractionManager.MAX_INTERACTIONS_TO_CONSIDER ||
			entry.duration > minLongestInteraction.latency
		) {
			// If the interaction already exists, update it. Otherwise create one.
			if (existingInteraction) {
				// If the new entry has a longer duration, replace the old entries,
				// otherwise add to the array.
				if (entry.duration > existingInteraction.latency) {
					existingInteraction.entries = [entry];
					existingInteraction.latency = entry.duration;
				} else if (
					entry.duration === existingInteraction.latency &&
					entry.startTime === existingInteraction.entries[0].startTime
				) {
					existingInteraction.entries.push(entry);
				}
			} else {
				const interaction = {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					id: entry.interactionId!,
					latency: entry.duration,
					entries: [entry],
				};
				this.longestInteractionMap.set(interaction.id, interaction);
				this.longestInteractionList.push(interaction);
			}

			// Sort the entries by latency (descending) and keep only the top ten.
			this.longestInteractionList.sort((a, b) => b.latency - a.latency);
			if (this.longestInteractionList.length > InteractionManager.MAX_INTERACTIONS_TO_CONSIDER) {
				this.longestInteractionList
					.splice(InteractionManager.MAX_INTERACTIONS_TO_CONSIDER)
					.forEach((i) => this.longestInteractionMap.delete(i.id));
			}
		}
	}
}
