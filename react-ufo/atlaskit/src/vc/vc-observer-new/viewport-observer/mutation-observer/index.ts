import { expVal } from '../../../expVal';

export type CreateMutationObserverProps = {
	onAttributeMutation: (props: {
		target: HTMLElement;
		attributeName: string;
		oldValue?: string | undefined | null;
		newValue?: string | undefined | null;
	}) => void;

	onMutationFinished?: (props: { targets: Array<HTMLElement> }) => void;
	onChildListMutation: (props: {
		target: WeakRef<HTMLElement>;
		addedNodes: ReadonlyArray<WeakRef<HTMLElement>>;
		removedNodes: ReadonlyArray<WeakRef<HTMLElement>>;
		timestamp: DOMHighResTimeStamp;
	}) => void;
};

// Batched mutation data for performance optimization
type BatchedMutation = {
	target: WeakRef<HTMLElement>;
	addedNodes: Array<WeakRef<HTMLElement>>;
	removedNodes: Array<WeakRef<HTMLElement>>;
	timestamp: DOMHighResTimeStamp;
};

function createMutationObserver({
	onAttributeMutation,
	onChildListMutation,
	onMutationFinished,
}: CreateMutationObserverProps): MutationObserver | null {
	if (!window || typeof window.IntersectionObserver !== 'function') {
		return null;
	}

	const mutationObserverCallback: MutationCallback = (mutations) => {
		const targets: Array<HTMLElement> = [];
		// Use nested Maps for O(1) batching performance
		// Short-lived Maps are safe since they're discarded after each callback
		const batchedMutations = new Map<DOMHighResTimeStamp, Map<HTMLElement, BatchedMutation>>();

		for (const mut of mutations) {
			if (!(mut.target instanceof HTMLElement)) {
				continue;
			}

			if (expVal('cc_editor_vc_exclude_flags', 'isEnabled', false)) {
				// Intended for excluding out of band mutations such as tooltips on hover, and page flags
				// Currently being tested in Confluence
				// Skip elements with data-vc-oob attribute
				if (mut.target.dataset.vcOob) {
					return;
				}
			}

			if (mut.type === 'attributes') {
				/*
					"MutationObserver was explicitly designed to work that way, but I can't now recall the reasoning.
					I think it might have been something along the lines that for consistency every setAttribute call should create a record.
					Conceptually there is after all a mutation: there is an old value replaced with a new one,
					and whether or not they are the same doesn't really matter.
					And Custom elements should work the same way as MutationObserver."
					https://github.com/whatwg/dom/issues/520#issuecomment-336574796
				*/
				const oldValue = mut.oldValue ?? undefined;
				const newValue = mut.attributeName ? mut.target.getAttribute(mut.attributeName) : undefined;
				if (oldValue !== newValue) {
					onAttributeMutation({
						target: mut.target,
						attributeName: mut.attributeName ?? 'unknown',
						oldValue,
						newValue,
					});
				}

				continue;
			} else if (mut.type === 'childList') {
				// In chromium browser MutationRecord has timestamp field, which we should use.
				const timestamp = Math.round((mut as any).timestamp || performance.now());

				// Get or create timestamp bucket
				let timestampBucket = batchedMutations.get(timestamp);
				if (!timestampBucket) {
					timestampBucket = new Map<HTMLElement, BatchedMutation>();
					batchedMutations.set(timestamp, timestampBucket);
				}

				// Get or create target batch within timestamp bucket
				let batch = timestampBucket.get(mut.target);
				if (!batch) {
					batch = {
						target: new WeakRef(mut.target),
						addedNodes: [],
						removedNodes: [],
						timestamp,
					};
					timestampBucket.set(mut.target, batch);
				}

				// Accumulate added nodes
				(mut.addedNodes ?? []).forEach((node: Node) => {
					if (node instanceof HTMLElement) {
						batch!.addedNodes.push(new WeakRef(node));
					}
				});

				// Accumulate removed nodes
				(mut.removedNodes ?? []).forEach((node: Node) => {
					if (node instanceof HTMLElement) {
						batch!.removedNodes.push(new WeakRef(node));
					}
				});
			}

			targets.push(mut.target);
		}

		// Process all batched childList mutations
		for (const timestampBucket of batchedMutations.values()) {
			for (const batch of timestampBucket.values()) {
				onChildListMutation({
					target: batch.target,
					addedNodes: batch.addedNodes,
					removedNodes: batch.removedNodes,
					timestamp: batch.timestamp,
				});
			}
		}

		onMutationFinished?.({
			targets,
		});
	};

	const observer = new MutationObserver(mutationObserverCallback);

	return observer;
}

export default createMutationObserver;
