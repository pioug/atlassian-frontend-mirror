/**
 * Copied from https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/analytics/analytics-listeners/src/helpers/logger.ts
 * In future if this package is migrated into the Atlassian Frontend repo, then this code and related logic should be
 * moved into @atlaskit/analytics-listeners.
 */

export const LOG_LEVEL = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	OFF: 4,
};

export default class Logger {
	logLevel: number = LOG_LEVEL.OFF;

	constructor({ logLevel }: { logLevel?: number } = {}) {
		if (typeof logLevel === 'number') {
			this.setLogLevel(logLevel);
		}
	}

	setLogLevel(logLevel: number): void {
		if (logLevel >= LOG_LEVEL.DEBUG && logLevel <= LOG_LEVEL.OFF) {
			this.logLevel = +logLevel;
		} else {
			this.logLevel = LOG_LEVEL.OFF;
		}
	}

	logMessage(
		level: number,
		type: keyof Pick<Console, 'log' | 'info' | 'warn' | 'error'>,
		...args: any[]
	): void {
		if (level >= this.logLevel) {
			// eslint-disable-next-line no-console
			console[type](...args);
		}
	}

	debug(...args: any[]): void {
		this.logMessage(LOG_LEVEL.DEBUG, 'log', ...args);
	}

	info(...args: any[]): void {
		this.logMessage(LOG_LEVEL.INFO, 'info', ...args);
	}

	warn(...args: any[]): void {
		this.logMessage(LOG_LEVEL.WARN, 'warn', ...args);
	}

	error(...args: any[]): void {
		this.logMessage(LOG_LEVEL.ERROR, 'error', ...args);
	}
}
