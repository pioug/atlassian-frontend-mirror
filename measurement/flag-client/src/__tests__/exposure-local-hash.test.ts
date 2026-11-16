/** @jest-environment node */
import { xxhash3 } from 'hash-wasm';

import { localHash64 } from '../exposure/local-hash';

it.each([
	['', '2d06800538d394c2'],
	['a', 'e6c632b61e964e1f'],
	['hello', '9555e8555c62dcfd'],
])('matches the XXH3-64 test vector %s', (input, expected) => {
	expect(localHash64(new TextEncoder().encode(input))).toBe(expected);
});

it('matches hash-wasm across short, medium, stripe and block boundaries and unaligned views', async () => {
	let state = 0x12345678;
	const lengths = [
		...Array.from({ length: 4097 }, (_, i) => i),
		8191,
		8192,
		8193,
		65535,
		65536,
		65537,
	];
	for (const length of lengths) {
		const bytes = new Uint8Array(length + 7);
		for (let i = 0; i < bytes.length; i++) {
			state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
			bytes[i] = state >>> 24;
		}
		for (const offset of [0, 1, 7]) {
			const view = bytes.subarray(offset, offset + length);
			expect(localHash64(view)).toBe(await xxhash3(view, 0, 0));
		}
	}
}, 30000);

it('hashes UTF-8 bytes consistently without modifying or retaining the input', async () => {
	for (const text of ['flag-🧪', '汉字', '\ud800']) {
		const bytes = new TextEncoder().encode(text);
		const original = bytes.slice();
		expect(localHash64(bytes)).toBe(await xxhash3(bytes));
		expect(bytes).toEqual(original);
	}
});
