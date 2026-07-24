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

export { ufolog } from './ufolog';
export { ufowarn } from './ufowarn';
