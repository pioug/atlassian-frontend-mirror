export enum ShadowKeys {
  SHOW_LEFT_SHADOW = 'showLeftShadow',
  SHOW_RIGHT_SHADOW = 'showRightShadow',
}

export type ShadowsStates = {
  [ShadowKey in ShadowKeys]: boolean;
};

export const shadowObserverClassNames = {
  SENTINEL_LEFT: 'sentinel-left',
  SENTINEL_RIGHT: 'sentinel-right',
  SHADOW_CONTAINER: 'with-shadow-observer',
};

const requestIdleCallback = (fn: FrameRequestCallback) => {
  return (window as any).requestIdleCallback
    ? (window as any).requestIdleCallback(fn)
    : window.requestAnimationFrame(fn);
};

const cancelIdleCallback = (id: number) => {
  return (window as any).cancelIdleCallback
    ? (window as any).cancelIdleCallback(id)
    : window.cancelAnimationFrame(id);
};

export class ShadowObserver {
  private intersectionObserver?: IntersectionObserver;
  private scrollContainer: HTMLElement;
  private onUpdateShadows: (eventData: ShadowsStates) => void;
  private sentinels: {
    right?: HTMLDivElement;
    left?: HTMLDivElement;
  } = {};

  private requestCallbackId?: number;

  readonly shadowStates: ShadowsStates = {
    [ShadowKeys.SHOW_LEFT_SHADOW]: false,
    [ShadowKeys.SHOW_RIGHT_SHADOW]: false,
  };

  constructor({
    scrollContainer,
    onUpdateShadows,
  }: {
    scrollContainer: HTMLElement;
    onUpdateShadows: (eventData: ShadowsStates) => void;
  }) {
    this.scrollContainer = scrollContainer;
    this.onUpdateShadows = onUpdateShadows;
    this.init();
  }

  private init = () => {
    if (!this.scrollContainer || this.intersectionObserver) {
      return;
    }

    this.sentinels.right = document.createElement('div');
    this.sentinels.right.classList.add(shadowObserverClassNames.SENTINEL_RIGHT);
    this.scrollContainer.appendChild(this.sentinels.right);

    this.sentinels.left = document.createElement('div');
    this.sentinels.left.classList.add(shadowObserverClassNames.SENTINEL_LEFT);
    this.scrollContainer.prepend(this.sentinels.left);

    this.intersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
        entries.forEach(this.onIntersect);
      },
      { root: this.scrollContainer },
    );

    this.intersectionObserver.observe(this.sentinels.left);
    this.intersectionObserver.observe(this.sentinels.right);
  };

  private onIntersect = (entry: IntersectionObserverEntry) => {
    this.requestCallbackId = requestIdleCallback(() => {
      if (
        entry.target.classList.contains(shadowObserverClassNames.SENTINEL_LEFT)
      ) {
        this.shadowStates[ShadowKeys.SHOW_LEFT_SHADOW] = !entry.isIntersecting;
      }

      if (
        entry.target.classList.contains(shadowObserverClassNames.SENTINEL_RIGHT)
      ) {
        this.shadowStates[ShadowKeys.SHOW_RIGHT_SHADOW] = !entry.isIntersecting;
      }

      this.onUpdateShadows(this.shadowStates);
    });
  };

  dispose() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
      this.requestCallbackId && cancelIdleCallback(this.requestCallbackId);
    }
  }
}
