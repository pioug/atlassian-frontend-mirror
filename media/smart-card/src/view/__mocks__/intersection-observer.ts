interface MockEntry {
  isIntersecting: boolean;
}
export interface MockIntersectionObserverOpts {
  getMockEntries: () => MockEntry[];
  disconnect: jest.Mock;
  takeRecords?: jest.Mock;
  unobserve?: jest.Mock;
}

// A mock IntersectionObserver, which, when the `observe()` method is called,
// immediately calls the callback which was passed to the constructor, with mocked entries.
export const MockIntersectionObserverFactory = (
  mockIntersectionObserverOpts: MockIntersectionObserverOpts,
) =>
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root!: Element | null;
    readonly rootMargin!: string;
    readonly thresholds!: ReadonlyArray<number>;

    constructor(public callback: IntersectionObserverCallback) {}

    observe(_element: HTMLElement) {
      this.callback(
        mockIntersectionObserverOpts.getMockEntries() as IntersectionObserverEntry[],
        this,
      );
    }
    disconnect = mockIntersectionObserverOpts.disconnect;
    takeRecords = mockIntersectionObserverOpts.takeRecords || jest.fn();
    unobserve = mockIntersectionObserverOpts.unobserve || jest.fn();
  };
