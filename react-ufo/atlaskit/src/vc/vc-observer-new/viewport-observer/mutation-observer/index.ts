export type CreateMutationObserverProps = {
	onAttributeMutation: (props: { target: HTMLElement; attributeName: string }) => void;

	onMutationFinished?: (props: { targets: Array<HTMLElement> }) => void;
	onChildListMutation: (props: {
		addedNodes: ReadonlyArray<WeakRef<HTMLElement>>;
		removedNodes: ReadonlyArray<WeakRef<HTMLElement>>;
	}) => void;
};

function createMutationObserver({
	onAttributeMutation,
	onChildListMutation,
	onMutationFinished,
}: CreateMutationObserverProps) {
	if (!window || typeof window.IntersectionObserver !== 'function') {
		return null;
	}

	const mutationObserverCallback: MutationCallback = (mutations) => {
		const addedNodes: Array<WeakRef<HTMLElement>> = [];
		const removedNodes: Array<WeakRef<HTMLElement>> = [];
		const targets: Array<HTMLElement> = [];

		for (const mut of mutations) {
			if (!(mut.target instanceof HTMLElement)) {
				continue;
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
					});
				}

				continue;
			} else if (mut.type === 'childList') {
				(mut.addedNodes ?? []).forEach((node: Node) => {
					if (node instanceof HTMLElement) {
						addedNodes.push(new WeakRef(node));
					}
				});

				(mut.removedNodes ?? []).forEach((node: Node) => {
					if (node instanceof HTMLElement) {
						removedNodes.push(new WeakRef(node));
					}
				});
			}

			targets.push(mut.target);
		}

		onChildListMutation({
			addedNodes,
			removedNodes,
		});

		onMutationFinished?.({
			targets,
		});
	};

	const observer = new MutationObserver(mutationObserverCallback);

	return observer;
}

export default createMutationObserver;
