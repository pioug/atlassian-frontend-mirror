import {
  ShadowKeys,
  ShadowObserver,
  shadowObserverClassNames,
} from '../../../ui/OverflowShadow/shadowObserver';

describe('ShadowsObserver', () => {
  let scrollContainer: HTMLElement;
  let scrollContent: HTMLElement;

  const onUpdateShadowsSpy = jest.fn();

  const observeSpy = jest.fn();
  const disconnectSpy = jest.fn();
  let originalObserver: IntersectionObserver;
  let shadowsObserver: ShadowObserver;
  let intersect: (options: TriggerIntersectOptions) => void;

  const mockRequestAnimationFrame = () =>
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: Function) => cb());

  beforeEach(() => {
    mockRequestAnimationFrame();
    shadowsObserver = new ShadowObserver({
      scrollContainer,
      onUpdateShadows: onUpdateShadowsSpy,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(() => {
    buildOverflowElements();
    originalObserver = (window as any).IntersectionObserver;
    const { observer, triggerIntersect } = createIntersectionObserverMock();
    (window as any).IntersectionObserver = observer;
    intersect = triggerIntersect;
  });

  afterAll(() => {
    (window as any).IntersectionObserver = originalObserver;
  });

  it('appends sentinel elements', () => {
    expect(
      scrollContainer.firstElementChild?.classList.contains(
        shadowObserverClassNames.SENTINEL_LEFT,
      ),
    ).toBe(true);
    expect(
      scrollContainer.lastElementChild?.classList.contains(
        shadowObserverClassNames.SENTINEL_RIGHT,
      ),
    ).toBe(true);
  });

  it('observes on the sentinel elements', () => {
    expect(observeSpy).toHaveBeenCalledWith(scrollContainer.firstElementChild);
    expect(observeSpy).toHaveBeenCalledWith(scrollContainer.lastElementChild);
  });

  it('disconnects intersection observer on dispose', () => {
    shadowsObserver.dispose();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  describe('calls the provided onUpdateShadows when intersecting', () => {
    it.each([
      [
        'hides left shadow when left sentinel intersects',
        {
          getTarget: () => scrollContainer.firstElementChild as HTMLElement,
          isIntersecting: true,
          expectedShadowStates: {
            [ShadowKeys.SHOW_LEFT_SHADOW]: false,
          },
        },
      ],
      [
        'shows left shadow when left sentinel does not intersect',
        {
          getTarget: () => scrollContainer.firstElementChild as HTMLElement,
          isIntersecting: false,
          expectedShadowStates: {
            [ShadowKeys.SHOW_LEFT_SHADOW]: true,
          },
        },
      ],
      [
        'hides right shadow when right sentinel intersects',
        {
          getTarget: () => scrollContainer.lastElementChild as HTMLElement,
          isIntersecting: true,
          expectedShadowStates: {
            [ShadowKeys.SHOW_RIGHT_SHADOW]: false,
          },
        },
      ],
      [
        'shows right shadow when right sentinel does not intersect',
        {
          getTarget: () => scrollContainer.lastElementChild as HTMLElement,
          isIntersecting: false,
          expectedShadowStates: {
            [ShadowKeys.SHOW_RIGHT_SHADOW]: true,
          },
        },
      ],
    ])('%s', (_name, { getTarget, isIntersecting, expectedShadowStates }) => {
      intersect({
        target: getTarget(),
        isIntersecting,
      });
      expect(onUpdateShadowsSpy).toHaveBeenCalledWith({
        ...shadowsObserver.shadowStates,
        ...expectedShadowStates,
      });
    });
  });

  // helpers

  function buildOverflowElements() {
    scrollContainer = document.createElement('div');
    scrollContent = document.createElement('table');
    scrollContainer.appendChild(scrollContent);
  }

  type TriggerIntersectOptions = {
    target: HTMLElement;
    isIntersecting: boolean;
    intersectionRatio?: number;
    rootBounds?: {
      bottom?: number;
      top?: number;
      height?: number;
      width?: number;
    };
    boundingClientRect?: {
      bottom?: number;
      top?: number;
      height: number;
      width?: number;
    };
  };

  function createIntersectionObserverMock(): {
    observer: IntersectionObserver;
    triggerIntersect: (options: TriggerIntersectOptions) => void;
  } {
    let intersectCallback: (entries: any[]) => {};
    return {
      observer: (function intersectionObserverMock(
        this: IntersectionObserver,
        callback: () => {},
      ) {
        this.disconnect = disconnectSpy;
        this.observe = observeSpy;
        intersectCallback = callback;
      } as unknown) as IntersectionObserver,

      triggerIntersect: ({
        target,
        isIntersecting,
        boundingClientRect,
        rootBounds,
        intersectionRatio,
      }: TriggerIntersectOptions) => {
        const entries = [
          {
            target,
            rootBounds,
            boundingClientRect,
            isIntersecting,
            intersectionRatio,
          },
        ];
        intersectCallback(entries);
      },
    };
  }
});
