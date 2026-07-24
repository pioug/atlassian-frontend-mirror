import { ufologger } from './index';

export const ufolog = (...args: Array<any>): void => {
	ufologger.log(...args);
};
