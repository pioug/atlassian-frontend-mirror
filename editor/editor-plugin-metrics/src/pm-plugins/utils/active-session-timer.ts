import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { type MetricsPlugin } from '../../metricsPluginType';

const ACTIVE_SESSION_IDLE_TIME = 5000;

export class ActiveSessionTimer {
	private timerId: number | null;
	private api: ExtractInjectionAPI<MetricsPlugin> | undefined;

	constructor(api: ExtractInjectionAPI<MetricsPlugin> | undefined) {
		this.timerId = null;
		this.api = api;
	}

	public startTimer = (): void => {
		if (this.timerId) {
			clearTimeout(this.timerId);
		}

		this.timerId = window.setTimeout(() => {
			if (this.api) {
				this.api.core.actions.execute(this.api.metrics?.commands.stopActiveSession());
			}
			this.cleanupTimer();
		}, ACTIVE_SESSION_IDLE_TIME);
	};

	public cleanupTimer = (): void => {
		if (this.timerId) {
			clearTimeout(this.timerId);
			this.timerId = null;
		}
	};
}
