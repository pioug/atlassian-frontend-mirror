import { isPromise } from '../../util/is-promise';

export const alwaysPromise = <T>(maybePromise: Promise<T> | T): Promise<T> => {
	if (isPromise(maybePromise)) {
		return maybePromise;
	}
	return Promise.resolve(maybePromise);
};
