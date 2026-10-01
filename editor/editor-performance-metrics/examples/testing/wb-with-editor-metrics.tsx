import React, { type ComponentType, lazy, Suspense } from 'react';

import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { getGlobalEditorMetricsObserver } from '../../src/internals/global';

let metricsStarted = false;

/**
 * Keep metrics setup in this package's testing entries, not the Workbench host.
 * Load the example only after metrics start so module-level work is observed too.
 */
export function wbWithEditorMetrics(
	loadExample: () => Promise<{ default: ComponentType }>,
): WorkbenchExample {
	const Example = lazy(() => {
		if (!metricsStarted) {
			const observer = getGlobalEditorMetricsObserver({
				timers: { setTimeout: { maxTimeoutAllowedToTrack: 5000 } },
			});
			observer.start({ startTime: 0 });
			metricsStarted = true;
		}

		return loadExample();
	});

	function MetricsExample(): React.JSX.Element {
		return (
			<Suspense fallback={null}>
				<Example />
			</Suspense>
		);
	}

	return wb(MetricsExample);
}
