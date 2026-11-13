/** Notifies mention chips when a provider's disabled-state inputs change. */
export class MentionDisabledStateChangeNotifier {
	private readonly listeners = new Set<() => void>();

	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	notify(): void {
		this.listeners.forEach((listener) => listener());
	}

	clear(): void {
		this.listeners.clear();
	}
}
