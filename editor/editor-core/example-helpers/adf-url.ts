import type { UrlObject } from 'url';
import { format } from 'url';

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import { decode_object, encode_object } from 'rison';

export function encode(input: object): string {
  const compressed = compressToEncodedURIComponent(encode_object(input));
  return `adf:${compressed}`;
}

export function decode<T = unknown>(input: string): T {
  if (!input.startsWith(`adf:`)) {
    // legacy: plain base64 encoded urlss
    return JSON.parse(decodeURIComponent(escape(atob(input || '{}'))));
  }

  const stripped = input.replace(/^adf:/, '');
  const decompressed = decompressFromEncodedURIComponent(stripped)!;
  return decode_object(decompressed) as T;
}

export function amend(location: Partial<UrlObject>, value: string): string {
  const search = new URLSearchParams(location.search || '');
  search.set('adf', value);

  return format({
    ...location,
    search: search.toString(),
  });
}

export function fromLocation<T>(
  location: Partial<UrlObject>,
): T | Error | undefined {
  const search = new URLSearchParams(location.search || '');
  const data = search.get('adf');

  if (!data) {
    return;
  }

  try {
    return decode(data);
  } catch (err) {
    return err instanceof Error ? err : undefined;
  }
}

export interface Message {
  type: 'warn' | 'error';
  title: string;
  message: string;
}

export function check(url: string): Message | undefined {
  if (url.length > 2000) {
    return {
      type: 'warn',
      title: 'URL too long',
      message: [
        'URLs longer than 2000 characters may not work in all browsers.',
        "Reduce document complexity if you're having problems.",
      ].join('\n'),
    };
  }
}
