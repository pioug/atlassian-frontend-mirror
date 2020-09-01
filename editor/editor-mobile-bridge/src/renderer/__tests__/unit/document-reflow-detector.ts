import { DocumentReflowDetector } from '../../../document-reflow-detector';

describe('DocumentReflowDetector', () => {
  let reflowDetector: DocumentReflowDetector;
  let container: HTMLDivElement | null;
  let resizeObserverSpy: jest.SpyInstance;
  let mutationObserverSpy: jest.SpyInstance;
  let resizeObserveSpy = jest.fn();
  let onReflowSpy = jest.fn();
  let resizeObserverMock = {
    disconnect: jest.fn(),
    observe: resizeObserveSpy,
    unobserve: jest.fn(),
  };
  let mutationObserveSpy = jest.fn();
  let mutationObserverMock = {
    disconnect: jest.fn(),
    observe: mutationObserveSpy,
    takeRecords: jest.fn(),
  };
  beforeEach(() => {
    container = document.createElement('div');
    (window.MutationObserver as any) = () => {};
    mutationObserverSpy = jest
      .spyOn(window, 'MutationObserver')
      .mockImplementation(() => {
        return mutationObserverMock;
      });
    (window.ResizeObserver as any) = () => {};
    resizeObserverSpy = jest
      .spyOn(window, 'ResizeObserver')
      .mockImplementation(() => {
        return resizeObserverMock;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
    container = null;
  });

  describe('when ResizeObserver is supported', () => {
    beforeEach(() => {
      reflowDetector = new DocumentReflowDetector({
        onReflow: onReflowSpy,
      });
    });

    it('is initialized with ResizeObserver', () => {
      expect(resizeObserverSpy).toHaveBeenCalled();
      expect(mutationObserverSpy).not.toHaveBeenCalled();
    });

    describe('when enabled', () => {
      beforeEach(() => {
        reflowDetector.enable(container);
      });

      it('observes provided root element', () => {
        expect(resizeObserveSpy).toHaveBeenCalledWith(container);
      });

      it('window resize calls provided onReflow callback', () => {
        window.dispatchEvent(new Event('resize'));
        expect(onReflowSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when ResizeObserver is not supported', () => {
    beforeEach(() => {
      (window.ResizeObserver as any) = null;
      reflowDetector = new DocumentReflowDetector({
        onReflow: onReflowSpy,
      });
    });

    it('is initialized with MutationObserver', () => {
      expect(mutationObserverSpy).toHaveBeenCalled();
      expect(resizeObserverSpy).not.toHaveBeenCalled();
    });

    describe('when enabled', () => {
      it('throws error if root element is not provided', () => {
        expect(() => {
          reflowDetector.enable(null);
        }).toThrow();
      });

      it('observes provided root element', () => {
        reflowDetector.enable(container);
        expect(mutationObserveSpy).toHaveBeenCalled();
        expect(onReflowSpy).toHaveBeenCalled();
      });
    });
  });
});
