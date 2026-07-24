import { ufologger } from './index';

export const ufowarn = (...args: Array<any>): void => {
	ufologger.warn(...args);
};
