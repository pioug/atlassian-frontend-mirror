import type { ResourceEntry } from '../resource-timing/common/types';

/* Borrowed from https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/performance/browser-metrics/src/plugins/timings/resource.ts */
export const cacheableTypes = ['script', 'link', 'other'];

export const MEMORY_KEY = 'mem';

export const DISK_KEY = 'disk';

export const NETWORK_KEY = 'net';

export const calculateTransferType = (
	name: string,
	type: string,
	duration: number,
	size: number | undefined,
) => {
	if (!cacheableTypes.includes(type) && !(type === 'other' && name.includes('.js'))) {
		return null;
	}

	if ((size === undefined || size === 0) && duration === 0) {
		return MEMORY_KEY;
	}
	if (size === 0 && duration > 0) {
		return DISK_KEY;
	}
	if (size === undefined) {
		return null;
	}

	return NETWORK_KEY;
};

export const getTypeOfRequest = ({ name, initiatorType: type }: ResourceEntry) => {
	let category = 'other';
	const urlWithoutQuery = name.split('?')[0];

	switch (type) {
		case 'script':
			category = 'js';
			break;
		case 'link':
			if (urlWithoutQuery.endsWith('.css')) {
				category = 'css';
			}
			if (urlWithoutQuery.endsWith('.js')) {
				category = 'js';
			}
			break;
		case 'img':
			category = 'image';
			break;
		case 'font':
			category = 'font';
			break;
		default:
			if (urlWithoutQuery.endsWith('.js')) {
				category = 'js';
			} else if (urlWithoutQuery.endsWith('.css')) {
				category = 'css';
			} else if (urlWithoutQuery.match(/\.(woff|woff2|ttf|otf)$/)) {
				category = 'font';
			} else if (urlWithoutQuery.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
				category = 'image';
			}
			break;
	}
	return category;
};

export const checkIfTimingsAvailable = (entry: ResourceEntry) => {
	if (
		entry.decodedSize === 0 &&
		entry.encodedSize === 0 &&
		entry.requestStart === 0 &&
		entry.responseStart === 0
	) {
		return false;
	}

	return true;
};

export const round = (n: number) => {
	if (isNaN(n)) {
		return 0;
	}
	return Math.round(n * 10000) / 10000;
};
