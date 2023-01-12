export class MockIntersectionObserver implements IntersectionObserver {
  readonly root!: Element | null;
  readonly rootMargin!: string;
  readonly thresholds!: ReadonlyArray<number>;

  constructor(public callback: IntersectionObserverCallback) {}

  observe(_element: HTMLElement) {
    const entries = [
      { isIntersecting: true, intersectionRatio: 1 },
    ] as IntersectionObserverEntry[];
    this.callback(entries, this);
  }
  disconnect = jest.fn();
  takeRecords = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
