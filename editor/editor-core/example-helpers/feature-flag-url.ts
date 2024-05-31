import type { UrlObject } from 'url';
import { format } from 'url';

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import * as RISON from 'rison';

export function encode(input: string): string {
	return compressToEncodedURIComponent(RISON.encode(input));
}

export function decode<T = unknown>(input: string): T {
	const decompressed = decompressFromEncodedURIComponent(input)!;
	return RISON.decode(decompressed) as T;
}

export function amend(location: Partial<UrlObject>, value: string): string {
	const search = new URLSearchParams(location.search || '');
	search.set('ff', value);

	return format({
		...location,
		search: search.toString(),
	});
}

export function fromLocation<T>(location: Partial<UrlObject>): T | Error | undefined {
	const search = new URLSearchParams(location.search || '');
	const data = search.get('ff');

	if (!data) {
		return;
	}

	try {
		return decode(data);
	} catch (err) {
		return err as Error;
	}
}

export interface Message {
	type: 'warn' | 'error';
	title: string;
	message: string;
}
