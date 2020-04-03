interface DocumentReflowDetectorInit {
  onReflow(height: number): void;
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
  private content: HTMLElement | null | undefined;
  private pageHeight?: number;
  private onReflowCallback: DocumentReflowDetectorInit['onReflow'];
  private mutationObserver: MutationObserver;

  constructor(init: DocumentReflowDetectorInit) {
    this.onReflowCallback = init.onReflow;
    this.mutationObserver = new MutationObserver(this.onMutation);
  }

  private onReflow = (options: { forced: boolean }) => {
    if (!this.content) {
      throw new Error(
        'Failed to find #renderer. Unable to utilise document reflow detector.',
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
    if (image.complete) return;
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

  public enable = () => {
    if (!this.enabled) {
      this.content = document.getElementById('renderer');

      // Listen for changes that may impact the page height
      window.addEventListener('resize', this.onResize);
      this.mutationObserver.observe(document.documentElement, {
        // Listen for changes to className, style, etc
        attributes: true,
        // Listen for changes to the nested structure of the page contents
        childList: true,
        subtree: true,
      });

      // Register images already in document
      document.querySelectorAll('img').forEach(this.registerImage);
    }

    // Announce initial height
    this.onReflow({ forced: true });
    this.enabled = true;
  };

  public disable = () => {
    this.content = undefined;
    this.mutationObserver.disconnect();
    window.removeEventListener('resize', this.onResize);
    document.querySelectorAll('img').forEach(this.unregisterImage);
    this.enabled = false;
  };
}
