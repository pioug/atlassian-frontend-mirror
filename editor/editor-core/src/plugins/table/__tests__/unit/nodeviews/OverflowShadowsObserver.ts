import { OverflowShadowsObserver } from '../../../nodeviews/OverflowShadowsObserver';
import { ShadowEvent } from '../../../types';

describe('OverflowShadowsObserver', () => {
  let table: HTMLTableElement;
  let td1: HTMLTableDataCellElement;
  let td2: HTMLTableDataCellElement;
  let wrapper: HTMLDivElement;
  const updateSpy = jest.fn();
  const observeSpy = jest.fn();
  const disconnectSpy = jest.fn();
  let originalObserver: IntersectionObserver;
  let overflowShadowsObserver: OverflowShadowsObserver;
  let intersect: (options: TriggerIntersectOptions) => void;
  beforeEach(() => {
    overflowShadowsObserver = new OverflowShadowsObserver(
      updateSpy,
      table,
      wrapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    buildTable();
    originalObserver = (window as any).IntersectionObserver;
    const { observer, triggerIntersect } = createIntersectionObserverMock();
    (window as any).IntersectionObserver = observer;
    intersect = triggerIntersect;
  });

  afterAll(() => {
    (window as any).IntersectionObserver = originalObserver;
  });

  it('observes on first and last table cells', () => {
    overflowShadowsObserver.observeCells();
    expect(observeSpy).toHaveBeenCalledWith(td1);
    expect(observeSpy).toHaveBeenCalledWith(td2);
  });

  it('does not re-observe if cells did not change', () => {
    overflowShadowsObserver.observeCells();
    observeSpy.mockClear();
    overflowShadowsObserver.observeCells();
    expect(observeSpy).not.toHaveBeenCalled();
  });

  it('disconnects intersection observer on dispose', () => {
    const overflowShadowsObserver = new OverflowShadowsObserver(
      updateSpy,
      table,
      wrapper,
    );
    overflowShadowsObserver.dispose();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  describe('calls the provided update function when intersecting', () => {
    beforeEach(() => {
      overflowShadowsObserver.observeCells();
    });

    it.each([
      [
        'hides first shadow when first cell fully intersects',
        {
          getTarget: () => td1,
          intersectionRatio: 1,
          isIntersecting: true,
          expectedShadow: ShadowEvent.SHOW_BEFORE_SHADOW,
          expectedShow: false,
        },
      ],
      [
        'hides last shadow when last cell fully intersects',
        {
          getTarget: () => td2,
          intersectionRatio: 1,
          isIntersecting: true,
          expectedShadow: ShadowEvent.SHOW_AFTER_SHADOW,
          expectedShow: false,
        },
      ],
      [
        'shows first shadow when first cell partially intersects',
        {
          getTarget: () => td1,
          intersectionRatio: 0,
          isIntersecting: true,
          expectedShadow: ShadowEvent.SHOW_BEFORE_SHADOW,
          expectedShow: true,
        },
      ],
      [
        'shows last shadow when last cell partially intersects',
        {
          getTarget: () => td2,
          intersectionRatio: 0,
          isIntersecting: true,
          expectedShadow: ShadowEvent.SHOW_AFTER_SHADOW,
          expectedShow: true,
        },
      ],
    ])(
      '%s',
      (
        _name,
        {
          getTarget,
          intersectionRatio,
          isIntersecting,
          expectedShadow,
          expectedShow,
        },
      ) => {
        intersect({
          boundingClientRect: {
            height: 10,
            width: 10,
          },
          rootBounds: {
            height: 100,
            width: 100,
          },
          intersectionRatio,
          target: getTarget(),
          isIntersecting,
        });
        expect(updateSpy).toHaveBeenCalledWith(expectedShadow, expectedShow);
      },
    );
  });

  // helpers

  function buildTable() {
    wrapper = document.createElement('div');
    table = document.createElement('table');
    wrapper.appendChild(table);
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    const tr = document.createElement('tr');
    tbody.appendChild(tr);
    td1 = document.createElement('td');
    td2 = document.createElement('td');
    tr.appendChild(td1);
    tr.appendChild(td2);
  }

  type TriggerIntersectOptions = {
    target: HTMLElement;
    isIntersecting: boolean;
    intersectionRatio: number;
    rootBounds?: {
      bottom?: number;
      top?: number;
      height?: number;
      width?: number;
    };
    boundingClientRect: {
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
