import {
	type AnalyticsCallback,
	type ErrorCallback,
	type InfoCallback,
	type ResourceProvider,
	type ResultCallback,
} from '../types';

export class AbstractResource<Result> implements ResourceProvider<Result> {
	protected changeListeners: Map<string, ResultCallback<Result>>;
	protected errListeners: Map<string, ErrorCallback>;
	protected infoListeners: Map<string, InfoCallback>;
	protected allResultsListeners: Map<string, ResultCallback<Result>>;
	protected analyticsListeners: Map<string, AnalyticsCallback>;

	constructor() {
		this.changeListeners = new Map<string, ResultCallback<Result>>();
		this.allResultsListeners = new Map<string, ResultCallback<Result>>();
		this.errListeners = new Map<string, ErrorCallback>();
		this.infoListeners = new Map<string, InfoCallback>();
		this.analyticsListeners = new Map<string, AnalyticsCallback>();
	}

	subscribe(
		key: string,
		callback?: ResultCallback<Result>,
		errCallback?: ErrorCallback,
		infoCallback?: InfoCallback,
		allResultsCallback?: ResultCallback<Result>,
		analyticsListeners?: AnalyticsCallback,
	): void {
		if (callback) {
			this.changeListeners.set(key, callback);
		}
		if (errCallback) {
			this.errListeners.set(key, errCallback);
		}
		if (infoCallback) {
			this.infoListeners.set(key, infoCallback);
		}
		if (allResultsCallback) {
			this.allResultsListeners.set(key, allResultsCallback);
		}
		if (analyticsListeners) {
			this.analyticsListeners.set(key, analyticsListeners);
		}
	}

	unsubscribe(key: string): void {
		this.changeListeners.delete(key);
		this.errListeners.delete(key);
		this.infoListeners.delete(key);
		this.allResultsListeners.delete(key);
		this.analyticsListeners.delete(key);
	}
}
