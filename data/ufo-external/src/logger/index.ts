class UFOLogger {
	enabled = false;
	static UFOprefix = '[ufo🛸]';

	log(...args: Array<any>): void {
		// eslint-disable-next-line no-console
		this.enabled && console.log(UFOLogger.UFOprefix, ...args);
	}
	warn(...args: Array<any>): void {
		// eslint-disable-next-line no-console
		this.enabled && console.warn(UFOLogger.UFOprefix, ...args);
	}

	enable(): void {
		this.enabled = true;
	}

	disable(): void {
		this.enabled = false;
	}
}

export const ufologger: UFOLogger = new UFOLogger();

/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead.
 * Retained only while consumers migrate off the barrel.
 */
export { ufolog } from './ufolog';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead.
 * Retained only while consumers migrate off the barrel.
 */
export { ufowarn } from './ufowarn';
