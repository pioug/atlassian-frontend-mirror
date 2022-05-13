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
// Changing the MockEntries will cause the IntersectionObserverCallback to be called again
// with the new values.
export const MockIntersectionObserverFactory = (
  mockIntersectionObserverOpts: MockIntersectionObserverOpts,
) =>
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root!: Element | null;
    readonly rootMargin!: string;
    readonly thresholds!: ReadonlyArray<number>;
    previousMockEntries: MockEntry[] = [];

    constructor(public callback: IntersectionObserverCallback) {}

    observe(_element: HTMLElement) {
      this.previousMockEntries = mockIntersectionObserverOpts.getMockEntries();
      this.callIntersectionObserverCallback();
      setTimeout(this.checkIntersection, 100);
    }

    callIntersectionObserverCallback = () => {
      this.callback(
        mockIntersectionObserverOpts.getMockEntries() as IntersectionObserverEntry[],
        this,
      );
    };

    checkIntersection = () => {
      const mockEntries = mockIntersectionObserverOpts.getMockEntries();
      if (this.previousMockEntries !== mockEntries) {
        this.previousMockEntries = mockEntries;
        this.callIntersectionObserverCallback();
      }
      setTimeout(this.checkIntersection, 100);
    };
    disconnect = mockIntersectionObserverOpts.disconnect;
    takeRecords = mockIntersectionObserverOpts.takeRecords || jest.fn();
    unobserve = mockIntersectionObserverOpts.unobserve || jest.fn();
  };
