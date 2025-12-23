type NestedPartial<T> = {
	[K in keyof T]?: Partial<T[K]>;
};

type SetupOptions = {
	observe?: () => void;
	disconnect?: () => void;
};

const noop = () => {};

export class MockIntersectionObserver {
	private callback: IntersectionObserverCallback = noop;
	private originalObserver?: IntersectionObserver;
	private mockObserver?: IntersectionObserver;
	private mockObserverInstance?: IntersectionObserver;

	private storeMockObserver({ observe, disconnect }: SetupOptions) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const outerThis = this;
		this.mockObserver = class {
			observe: (elem?: any) => void = observe ?? noop;
			unobserve: () => void = noop;
			disconnect: () => void = disconnect ?? noop;
			constructor(callback: IntersectionObserverCallback) {
				outerThis.callback = callback;
				outerThis.mockObserverInstance = this as unknown as IntersectionObserver;
			}
		} as unknown as IntersectionObserver;
	}

	private addMockObserverToWindow() {
		this.originalObserver = (window as any).IntersectionObserver;
		(window as any).IntersectionObserver = this.mockObserver;
	}

	private removeMockObserverFromWindow() {
		(window as any).IntersectionObserver = this.originalObserver;
	}

	public setup(options: SetupOptions = {}): void {
		this.storeMockObserver(options);
		this.addMockObserverToWindow();
	}

	public cleanup(): void {
		this.removeMockObserverFromWindow();
	}

	public triggerIntersect(entry: NestedPartial<IntersectionObserverEntry>): void {
		const entries = [entry as unknown as IntersectionObserverEntry];
		this.callback(entries, this.mockObserverInstance!);
	}
}
