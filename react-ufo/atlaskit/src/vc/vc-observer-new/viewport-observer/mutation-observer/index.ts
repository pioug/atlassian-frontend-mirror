export type CreateMutationObserverProps = {
	onAttributeMutation: (props: { target: HTMLElement; attributeName: string }) => void;

	onMutationFinished?: (props: { targets: Array<HTMLElement> }) => void;
	onChildListMutation: (props: {
		addedNodes: ReadonlyArray<HTMLElement>;
		removedNodes: ReadonlyArray<HTMLElement>;
	}) => void;
};

export default function createMutationObserver({
	onAttributeMutation,
	onChildListMutation,
	onMutationFinished,
}: CreateMutationObserverProps) {
	if (!window || typeof window.IntersectionObserver !== 'function') {
		return null;
	}

	const observer = new MutationObserver((mutations) => {
		const addedNodes: Array<HTMLElement> = [];
		const removedNodes: Array<HTMLElement> = [];
		const targets: Array<HTMLElement> = [];

		for (const mut of mutations) {
			if (!(mut.target instanceof HTMLElement)) {
				continue;
			}
			if (mut.type === 'attributes') {
				onAttributeMutation({
					target: mut.target,
					attributeName: mut.attributeName ?? 'unknown',
				});
				continue;
			} else if (mut.type === 'childList') {
				(mut.addedNodes ?? []).forEach((node: Node) => {
					if (node instanceof HTMLElement) {
						addedNodes.push(node);
					}
				});

				(mut.removedNodes ?? []).forEach((node: Node) => {
					if (node instanceof HTMLElement) {
						removedNodes.push(node);
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
	});

	return observer;
}
