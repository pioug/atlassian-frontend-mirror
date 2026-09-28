import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example10BasicCreateAndFireSource } from './10-basic-create-and-fire';
import { default as Example10BasicErrorBoundarySource } from './10-basic-error-boundary';
import { default as Example11ErrorBoundaryWithErrorComponentSource } from './11-error-boundary-with-error-component';
import { default as Example12ErrorBoundaryWithNoErrorComponentSource } from './12-error-boundary-with-no-error-component';
import { default as Example20AddingAnalyticsContextSource } from './20-adding-analytics-context';
import { default as Example30PassingEventsToACallbackSource } from './30-passing-events-to-a-callback';
import { default as Example40UpdatingAnEventSource } from './40-updating-an-event';
import { default as Example50CloningAnEventSource } from './50-cloning-an-event';
import { default as Example60AsyncFiringSource } from './60-async-firing';

export const Example10BasicCreateAndFire: WorkbenchExample<
	typeof Example10BasicCreateAndFireSource
> = wb(Example10BasicCreateAndFireSource);
export const Example10BasicErrorBoundary: WorkbenchExample<
	typeof Example10BasicErrorBoundarySource
> = wb(Example10BasicErrorBoundarySource);
export const Example11ErrorBoundaryWithErrorComponent: WorkbenchExample<
	typeof Example11ErrorBoundaryWithErrorComponentSource
> = wb(Example11ErrorBoundaryWithErrorComponentSource);
export const Example12ErrorBoundaryWithNoErrorComponent: WorkbenchExample<
	typeof Example12ErrorBoundaryWithNoErrorComponentSource
> = wb(Example12ErrorBoundaryWithNoErrorComponentSource);
export const Example20AddingAnalyticsContext: WorkbenchExample<
	typeof Example20AddingAnalyticsContextSource
> = wb(Example20AddingAnalyticsContextSource);
export const Example30PassingEventsToACallback: WorkbenchExample<
	typeof Example30PassingEventsToACallbackSource
> = wb(Example30PassingEventsToACallbackSource);
export const Example40UpdatingAnEvent: WorkbenchExample<typeof Example40UpdatingAnEventSource> = wb(
	Example40UpdatingAnEventSource,
);
export const Example50CloningAnEvent: WorkbenchExample<typeof Example50CloningAnEventSource> = wb(
	Example50CloningAnEventSource,
);
export const Example60AsyncFiring: WorkbenchExample<typeof Example60AsyncFiringSource> = wb(
	Example60AsyncFiringSource,
);
