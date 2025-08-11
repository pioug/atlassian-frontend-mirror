import { gunzip } from 'fflate';

export function extractCompressedBase64(data: string, output: 'blob'): Promise<Blob>;
export function extractCompressedBase64(data: string, output: 'uint'): Promise<Uint8Array>;
export function extractCompressedBase64(data: string): Promise<Uint8Array>;

export async function extractCompressedBase64(
	data: string,
	output: 'uint' | 'blob' = 'uint',
): Promise<unknown> {
	const uint = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
	const decompressed = await new Promise<Uint8Array>((res, rej) =>
		gunzip(uint, (err, data) => (err ? rej(err) : res(data))),
	);
	if (output === 'uint') {
		return decompressed;
	}
	// @ts-ignore - TS2345 TypeScript 5.9.2 upgrade
	return new Response(decompressed).blob();
}
