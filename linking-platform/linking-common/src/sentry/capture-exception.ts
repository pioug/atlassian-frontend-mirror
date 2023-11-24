import type {
  BrowserOptions,
  EventHint,
  Scope,
  Event as SentryEvent,
} from '@sentry/browser';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Integration, Primitive } from '@sentry/types';

const SENTRY_DSN =
  'https://930d59a44d4acae29778d788c6391ed3@o55978.ingest.sentry.io/4506181365596160';

const sanitiseSentryEvents = (
  data: SentryEvent,
  _hint?: EventHint,
): PromiseLike<SentryEvent | null> | SentryEvent | null => {
  // Remove URL as it has UGC
  // TODO: Sanitise the URL instead of just removing it
  if (data.request) {
    delete data.request.url;
  }

  return data;
};

export const captureException = async (
  error: Error,
  packageName: string,
  tags?: { [key: string]: Primitive },
) => {
  try {
    // We don't want to log exceptions for branch deploys or in development / test scenarios
    if (
      process.env.NODE_ENV !== 'production' ||
      process.env.CLOUD_ENV === 'branch'
    ) {
      return;
    }

    const { BrowserClient, defaultIntegrations, getCurrentHub } = await import(
      /* webpackChunkName: "@atlaskit-internal_linking-common-sentrybrowser" */ '@sentry/browser'
    );
    const { ExtraErrorData } = await import(
      /* webpackChunkName: "@atlaskit-internal_linking-common-sentryintegrations" */ '@sentry/integrations'
    );

    const sentryOptions: BrowserOptions = {
      dsn: SENTRY_DSN,
      environment: process.env.CLOUD_ENV ?? 'unknown',
      ignoreErrors: [
        // Network issues
        // /^network error/i,
        // /^network failure/i,
        // 'TypeError: Failed to fetch',
        // A benign error, see https://stackoverflow.com/a/50387233/2645305
        // 'ResizeObserver loop limit exceeded',
        // /ResizeObserver loop completed with undelivered notifications/,
      ],
      autoSessionTracking: false,
      integrations: (_integrations: Integration[]): Integration[] => [
        // Remove the Breadcrumbs integration from the default as it's too likely to log UGC/PII
        // https://docs.sentry.io/platforms/javascript/configuration/integrations/default/
        ...defaultIntegrations.filter(({ name }) => name !== 'Breadcrumbs'),
        // Extracts all non-native attributes from the error object and attaches them to the event as the extra data
        // https://docs.sentry.io/platforms/javascript/configuration/integrations/plugin/?original_referrer=https%3A%2F%2Fduckduckgo.com%2F#extraerrordata
        new ExtraErrorData(),
      ],
      beforeSend: sanitiseSentryEvents,
    };
    // Use a client to avoid picking up the errors from parent applications
    const client = new BrowserClient(sentryOptions);
    const hub = getCurrentHub();
    hub.bindClient(client);

    hub.withScope((scope: Scope) => {
      scope.setTags({
        // Jira environment variables
        'jira-bundler': (window as any).BUNDLER_VERSION,
        'jira-variant': (window as any).BUILD_VARIANT,
        'jira-release': (window as any).BUILD_KEY,
        // Confluence environment variables
        'confluence-frontend-version': (window as any).__buildInfo
          ?.FRONTEND_VERSION,
        packageName,
        ...tags,
      });
      // Explicitly remove the breadcrumbs as it's too likely to log UGC/PII to side-step the hub integrations not being respected
      scope.clearBreadcrumbs();

      hub.captureException(error);
    });

    return client.close();
  } catch (_error) {
    // Error reporting failed, we don't want this to generate more errors
  }
};
