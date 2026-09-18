/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export type BM3Marks = { [key: string]: number };

export type BM3TimingsConfig = {
	key: string;
	startMark?: string;
	endMark?: string;
};

/**
 * @deprecated Use `import { getBm3Timings } from '@atlaskit/react-ufo/get-bm3-timings'` instead.
 */
export { getBm3Timings } from './getBm3Timings';
/**
 * @deprecated Use `import { UFOBM3TimingsToUFO } from '@atlaskit/react-ufo/ufobm3-timings-to-ufo'` instead.
 */
export { UFOBM3TimingsToUFO } from './UFOBM3TimingsToUFO';
/**
 * @deprecated Use `import { addBM3TimingsToUFO } from '@atlaskit/react-ufo/add-bm3-timings-to-ufo'` instead.
 */
export { addBM3TimingsToUFO } from './addBM3TimingsToUFO';
