// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockIntersectionObserver } from '@atlaskit/editor-test-helpers/mock-intersection-observer';

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
  let shadowsObserver: ShadowObserver;
  const mockObserver = new MockIntersectionObserver();

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
    mockObserver.setup({ observe: observeSpy, disconnect: disconnectSpy });
  });

  afterAll(() => {
    mockObserver.cleanup();
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
      mockObserver.triggerIntersect({
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
});
