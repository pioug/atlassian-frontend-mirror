type UserBrowserExtension = 'grammarly';
export type UserBrowserExtensionResults = UserBrowserExtension[];

type NotifyDetected = () => void;
type ScheduledCleanupWork = () => void;
type ScheduleCleanup = (cb: ScheduledCleanupWork) => void;

type DetectorFns = {
  sync: () => boolean;
  async: (detected: NotifyDetected, cleanup: ScheduleCleanup) => void;
};

type DetectorRegistration = {
  name: UserBrowserExtension;
  fns: Partial<DetectorFns>;
};

type Detector = DetectorRegistration & {
  state: { detected: boolean };
};

const registerDetectors = (
  targetExtensions: UserBrowserExtension[],
  supportedDetectors: DetectorRegistration[],
): Detector[] => {
  const detectors = supportedDetectors.filter((registration) =>
    targetExtensions.includes(registration.name),
  );
  return detectors.map((detector) => ({
    name: detector.name,
    state: { detected: false },
    fns: {
      async: detector.fns.async,
      sync: detector.fns.sync,
    },
  }));
};

type BaseOptions = {
  extensions: UserBrowserExtension[];
};

type AsyncOptions = BaseOptions & {
  async: true;
  asyncTimeoutMs: number;
};

type SyncOptions = BaseOptions & {
  async?: false;
  asyncTimeoutMs?: never;
};

type Options = BaseOptions & (SyncOptions | AsyncOptions);

const RACE_COMPLETE = 'race_complete';

const SELECTORS = {
  GRAMMARLY:
    'grammarly-extension, grammarly-popups, [data-grammarly-shadow-root]',
};

/**
 * This is the official list of supported browser extension detectors. To add support
 * for detecting an additional browser extension, simply add a (DetectorRegistration)
 * object like below to the list:
 *
 * ```
 * {
 *  name: 'exampleExtension',
 *  fns: {
 *    // a synchronous check that should return true if the extension is detected
 *    sync: () => !!document.querySelector(".some-example-class"),
 *    // an asynchronous check that should invoke 'detected' if the extension is detected.
 *    // it can also invoke 'cleanup' with a callback to schedule cleanup tasks
 *    // (such as disconnecting observers).
 *    async: (detected, cleanup) => {
 *      if (document.querySelector(".some-example-class")) {
 *        detected();
 *      }
 *    }
 *  }
 * }
 * ```
 */
const supportedDetectors: DetectorRegistration[] = [
  {
    name: 'grammarly',
    fns: {
      sync: () => Boolean(document?.querySelector(SELECTORS.GRAMMARLY)),
      async: (detected, cleanup) => {
        // First check to see if grammarly already exists on page
        const exists = Boolean(document?.querySelector(SELECTORS.GRAMMARLY));
        if (exists) {
          detected();
        }
        // Otherwise, setup a mutation observer to observe the page and its children
        // for newly added nodes. Collect observed mutations in a queue and in 1 second
        // intervals either process the queue or schedule the processing task for when
        // the user agent's main thread is idle (if possible).
        let queue: MutationRecord[][] = [];
        const processQueue = () => {
          for (const mutations of queue) {
            for (const mutation of mutations) {
              if (
                mutation?.type === 'childList' &&
                mutation?.addedNodes?.length
              ) {
                const exists = Array.from(mutation.addedNodes).some((node) =>
                  node.parentElement?.querySelector(SELECTORS.GRAMMARLY),
                );
                if (exists) {
                  detected();
                }
              }
            }
          }
          queue = [];
        };
        const intervalId = setInterval(() => {
          if (typeof (window as any).requestIdleCallback === 'function') {
            (window as any).requestIdleCallback(processQueue);
          } else {
            window.requestAnimationFrame(processQueue);
          }
        }, 1000);
        const observer = new MutationObserver((mutations) => {
          queue.push(mutations);
        });
        cleanup(() => {
          queue = [];
          clearInterval(intervalId);
          observer?.disconnect();
        });
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      },
    },
  },
];

/**
 * Call this to return a list (or a Promise of a list) of detected browser extensions.
 *
 * This function supports a **synchronous** and **asynchronous** mode through options. You
 * must pass a list of the browser extension names you want to target for detection.
 * Only UserBrowserExtension extensions are supported, other target names will be silently
 * ignored.
 *
 * If the async option is enabled, you must also pass a final timeout by when it
 * should stop all detection attempts and return any partially detected extensions.
 *
 * Example usage:
 * ```
 * // synchronously/immediately check for extensions
 * const extensions = sniffUserBrowserExtensions({ extensions: ['grammarly', 'requestly'] });
 * // result will be ['grammarly'] or ['grammarly','requestly'] or ['requestly'] or [];
 *
 * // asynchronously check for extensions up to 30s
 * sniffUserBrowserExtensions({
 *    extensions: ['grammarly', 'requestly'],
 *    async: true,
 *    asyncTimeoutMs: 30000,
 *  }).then(extensions => {
 *    // result will be  ['grammarly'] or ['grammarly','requestly'] or ['requestly'] or [];
 *  })
 * ```
 */
export function sniffUserBrowserExtensions<O extends Options>(
  options: O,
): O extends AsyncOptions
  ? Promise<UserBrowserExtensionResults>
  : UserBrowserExtensionResults;
export function sniffUserBrowserExtensions(
  options: Options,
): Promise<UserBrowserExtensionResults> | UserBrowserExtensionResults {
  try {
    // First we filter out supported extensions that aren't requested through options. We also
    // prepare detector objects with some initial internal state (e.g. detector.state.detected = false)
    const detectors = registerDetectors(options.extensions, supportedDetectors);
    // If async mode is enabled, we convert the list of detector objects to a list of promises
    // that resolve when the detector invokes detected() during its asynchronous check.
    // We also track any scheduled cleanup() tasks.
    if (options.async === true) {
      const asyncCleanups: ScheduledCleanupWork[] = [];
      const asyncDetections = Promise.all(
        detectors.map((detector) => {
          return new Promise<void>((resolve) => {
            const detected: NotifyDetected = () => {
              detector.state.detected = true;
              resolve();
            };
            const cleanup: ScheduleCleanup = (cb) => {
              asyncCleanups.push(cb);
            };
            if (typeof detector.fns.async === 'function') {
              detector.fns.async(detected, cleanup);
            } else {
              detector.state.detected = false;
              resolve();
            }
          });
        }),
      );
      // We race all asynchronous checkers against a user-defined timeout (asyncTimeoutMs).
      // When asynchronous checks are finalised first,or if the timeout elapses, we return
      // the list of extensions detected up until that point.
      const globalTimeout = new Promise((resolve) =>
        setTimeout(resolve, options.asyncTimeoutMs, RACE_COMPLETE),
      );
      return (
        Promise.race([asyncDetections, globalTimeout])
          .then(() => {
            return detectors
              .filter((detector) => detector.state.detected)
              .map((detector) => detector.name);
          })
          // If there are any errors, we fail safely and silently with zero detected extensions.
          .catch(() => [])
          .finally(() => asyncCleanups.map((cleanup) => cleanup()))
      );
    } else {
      // If sync mode, we immediately execute synchronous checks
      // and return a list of extensions whose synchronous checks returned true.
      return detectors
        .filter((detector) => detector.fns.sync?.())
        .map((detector) => detector.name);
    }
  } catch (err) {
    // If there are any unhandled errors, we fail safely and silently with zero detected extensions.
    return options.async ? Promise.resolve([]) : [];
  }
}
