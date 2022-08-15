# Retry Operation

> Retry Operation is a handler around any async operation (not just fetch requests) that will automatically retry every X ms, N times when specific errors are thrown

### Team
**Activity Platform / Recent Work**

**Slack**: #rw-team

## Instructions

`import { DEFAULT_RETRIES, FailedFetchError, retryOnException } from "@atlaskit/frontend-utilities/retry-operation";`

### FailedFetchError / GraphQLFragmentError

These are custom error classes that `extends Error`. Feel free to add your own!

### retryOnException

`retryOnException` allows you to retry an async operation any number of times, at any interval, when specifically defined
exceptions are thrown. You can define your own exceptions to be retried by creating a new class and extending `Error`
or by passing through a function that performs a test on the `error` thrown and returning a `boolean`.

We also provider handlers so that you can gain a better understanding of what is happening underneath.

#### Usage

```ts
const result = await retryOnException<TResult>(
    asyncOperation,
    {
      intervalsMS: DEFAULT_RETRIES,
      retryOn: [FailedFetchError],
      captureException: this.captureException,
      onRetry: this.logNumRetries
    },
);
```

### Constants

We also export predefined retry intervals for convenience.

```ts
NO_RETRIES                  = []
UP_TO_TWO_INSTANT_RETRIES   = [0, 0]
DEFAULT_RETRIES             = [0, 50, 100]
LAZY_LOAD_RETRIES           = [100, 500, 1000]
```
