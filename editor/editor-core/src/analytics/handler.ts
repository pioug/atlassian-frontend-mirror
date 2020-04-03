export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface AnalyticsHandler {
  (name: string, properties?: AnalyticsProperties): any;
}

/**
 * Provider using globally available, configured Herment instance.
 *
 * @link https://bitbucket.org/atlassian/herment/overview
 */
export function hermentHandler(
  name: string,
  properties?: AnalyticsProperties,
): void {
  try {
    window.AJS.EventQueue.push({ name, properties });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      'Unable to send analytics event via Herment - has it been initialized?',
      e,
    );
  }
}

export function debugHandler(
  name: string,
  properties?: AnalyticsProperties,
): void {
  // eslint-disable-next-line no-console
  console.info(
    'analytics event: ',
    name,
    properties ? properties : '[no properties]',
  );
}

/**
 * Attempt to detect analytics provider.
 */
export function detectHandler(): AnalyticsHandler {
  // Check Herment is globally available
  if (
    typeof window !== 'undefined' &&
    window.AJS &&
    window.AJS.EventQueue &&
    typeof window.AJS.EventQueue.push === 'function'
  ) {
    return hermentHandler;
  }

  // Unable to detect a suitable handler
  return () => null;
}

// This declaration is needed for TS to allow invoking Herment queue methods

declare global {
  interface Window {
    AJS: {
      EventQueue: { push: (...args: any[]) => any };
    };
  }
}
