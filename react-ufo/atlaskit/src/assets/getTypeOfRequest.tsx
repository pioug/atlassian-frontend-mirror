import type { ResourceEntry } from '../resource-timing/common/types';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getTypeOfRequest({ name, initiatorType: type }: ResourceEntry): string {
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
}
