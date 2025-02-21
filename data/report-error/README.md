# Platform error reporter

Platform error bus can be used by platform component to report errors to products.

## Platform usage

```js
import { reportError } from '@atlaskit/report-error';

reportError({
	error: Error; // Error
	errorInfo: ErrorInfo; // ErrorInfo from 'react', available within ErrorBoundary
	interractionId?: string; // UFO interractionId, if available
})
```

## Product usage

```js
// product root file
import { installErrorHandler } from '@atlaskit/report-error';

installErrorHandler(({
	error: Error; // Error
	errorInfo: ErrorInfo; // ErrorInfo from 'react', available within ErrorBoundary
	interactionId?: string; // UFO interractionId, if available
}) => {
	// log error to splunk

	// log error to sentry

	// any other custom error logging...
});
```
