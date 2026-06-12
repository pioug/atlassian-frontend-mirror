/**
 * Util for converting a css pixel size value to a number (of pixels).
 *
 * ie.
 * ```ts
 * const pixels = parsePx('10px')
 * //    ^$ const pixels: number
 * ```
 * * ```ts
 * const pixels = parsePx('10')
 * //    ^$ const pixels: number | undefined
 * ```
 */
// At time of writting prettier would strip the extend here.
// prettier-ignore
export function parsePx<PXString extends `${number}px`>(pxStr: PXString): number;
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function parsePx<PXString extends string>(pxStr: PXString): number | undefined;
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function parsePx(pxStr: string): number | undefined {
	if (!pxStr.endsWith('px')) {
		return undefined;
	}

	const maybeNumber = parseInt(pxStr, 10);
	return !Number.isNaN(maybeNumber) ? maybeNumber : undefined;
}
