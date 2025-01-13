import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import { type MetricsPlugin } from '../../metricsPluginType';

export class ActiveSessionTimer {
	private timerId: number | null;
	private api: ExtractInjectionAPI<MetricsPlugin> | undefined;

	constructor(api: ExtractInjectionAPI<MetricsPlugin> | undefined) {
		this.timerId = null;
		this.api = api;
	}

	public startTimer = () => {
		if (this.timerId) {
			clearTimeout(this.timerId);
		}

		this.timerId = window.setTimeout(() => {
			this.cleanupTimer();
		}, 3000);
	};

	public cleanupTimer = () => {
		if (this.api) {
			this.api.core.actions.execute(this.api.metrics?.commands.stopActiveSession());
		}

		if (this.timerId) {
			clearTimeout(this.timerId);
			this.timerId = null;
		}
	};
}
