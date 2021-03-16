import debounce from 'lodash/debounce';

interface DocumentReflowDetectorInit {
  onReflow(height: number): void;
}

/**
 *  Adding this is a temporary fix for a type error from @visx/responsive.
 *  We use @visx/responsive for our new charts library.
 *  It has a global decleration of ResizeObserver type
 *  that causes type errors in this file.
 *  We filed an issue at https://github.com/airbnb/visx/issues/1104.
 *  Will remove this once we get a fix on the Visx side.
 * */
declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
}

const isHtmlElement = (node: Node): node is HTMLElement => node.nodeType === 1;
const isImageElement = (node: HTMLElement): node is HTMLImageElement =>
  node.tagName === 'IMG';

/**
 * Document Reflow Detector
 *
 * In the scenario where mobile resizes the WebView to fit the page content
 * (so they can use native scrolling instead of web scrolling) we need to
 * inform them whenever the page content changes so that they can adjust
 * the WebView height to match.
 *
 * Scenarios where the page content may change after the initial document
 * load include, but are not limited to:
 *
 * 1. Resolving smart links switching from url text to inline cards.
 * 2. The user toggling a native expand open/closed.
 * 3. External media which doesn't know the image aspect ratio up front.
 */
export class DocumentReflowDetector {
  private enabled: boolean = false;
  private content: HTMLElement | Element | HTMLDivElement | null | undefined;
  private pageHeight?: number;
  private onReflowCallback: DocumentReflowDetectorInit['onReflow'];
  private observer: ResizeObserver | MutationObserver;
  private isResizeObserverAvailable: boolean = !!(window as any).ResizeObserver;
  private resizeEventDebounced: (() => void) | undefined;

  constructor(init: DocumentReflowDetectorInit) {
    this.onReflowCallback = init.onReflow;
    // ResizeObserver is more performant for browsers which support it
    this.observer = this.isResizeObserverAvailable
      ? new (window as any).ResizeObserver(this.onResizeObservation)
      : new MutationObserver(this.onMutation);
  }

  private onReflow = (options: { forced: boolean }) => {
    if (!this.content) {
      throw new Error(
        'Failed to find HTML element. Unable to utilise document reflow detector.',
      );
    }

    // We measure using the inner content div rather than `document.scrollingElement` because
    // for the latter, in the scenario where the content height is less than the initial
    // viewport height, it would always return the viewport height and not allow shrinking to fit.
    const pageHeight = this.content.scrollHeight;

    // Only announce legitimate changes
    if (options.forced || pageHeight !== this.pageHeight) {
      this.pageHeight = pageHeight;
      this.onReflowCallback(pageHeight);
    }
  };

  private onResizeObservation = (entries: ResizeObserverEntry[]) => {
    const height =
      (entries && entries[0].target.getBoundingClientRect().height) || 0;
    this.onReflowCallback(Math.round(height));
  };

  private onResize = () => {
    this.onReflow({ forced: false });
  };

  private onImageComplete = (e: Event) => {
    const target = e.target as null | HTMLImageElement;

    if (target) {
      this.unregisterImage(target);

      if (!this.enabled) {
        // Handle the unlikely scenario where the detector is disabled
        // during a loading phase.
        return;
      }

      this.onReflow({ forced: false });
    }
  };

  private registerImage = (image: HTMLImageElement): void => {
    if (image.complete) {
      return;
    }
    image.addEventListener('load', this.onImageComplete);
    image.addEventListener('abort', this.onImageComplete);
    image.addEventListener('error', this.onImageComplete);
  };

  private unregisterImage = (image: HTMLImageElement): void => {
    image.removeEventListener('load', this.onImageComplete);
    image.removeEventListener('abort', this.onImageComplete);
    image.removeEventListener('error', this.onImageComplete);
  };

  private checkForImageMutations = (mutations: MutationRecord[]) => {
    for (let i = 0; i < mutations.length; i++) {
      for (let j = 0; j < mutations[i].addedNodes.length; j++) {
        const node = mutations[i].addedNodes[j];

        if (!isHtmlElement(node)) {
          // Ignore non-nodes
          continue;
        }

        if (!isImageElement(node)) {
          // Ignore non-images
          continue;
        }

        if (node.complete) {
          // Ignore cached images
          continue;
        }

        // Listen for loading events to account for potential height changes.
        this.registerImage(node);
      }
    }
  };

  private onMutation = (mutations: MutationRecord[]) => {
    // Internal media (via our media services) knows the dimensions
    // and aspect ratio up front and reserves the correct space during
    // loading, however external media doesn't.
    // An additional call to `onReflow` will get async triggered if applicable.
    this.checkForImageMutations(mutations);

    // Handle user-triggered mutations
    this.onReflow({ forced: false });
  };

  public enable = (rootElement: HTMLElement | null) => {
    if (!this.enabled) {
      this.content = rootElement;

      if (!rootElement) {
        throw new Error(`Root element is not provided`);
      }

      // Listen for changes that may impact the page height
      this.resizeEventDebounced = debounce(this.onResize, 100);
      window.addEventListener('resize', this.resizeEventDebounced);

      if (this.isResizeObserverAvailable) {
        this.observer.observe(rootElement!);
      } else {
        this.observer.observe(document.documentElement, {
          // Listen for changes to className, style, etc
          attributes: true,
          // Listen for changes to the nested structure of the page contents
          childList: true,
          subtree: true,
        });

        // Register images already in document
        document.querySelectorAll('img').forEach(this.registerImage);
        // Announce initial height
        this.onReflow({ forced: true });
      }
    }

    this.enabled = true;
  };

  public disable = () => {
    if (this.resizeEventDebounced) {
      window.removeEventListener('resize', this.resizeEventDebounced);
    }

    if (!this.isResizeObserverAvailable) {
      document.querySelectorAll('img').forEach(this.unregisterImage);
    }

    this.content = undefined;
    this.observer.disconnect();
    this.enabled = false;
  };
}
