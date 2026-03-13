export * from './types';
export * from './serviceResources';
import * as serviceUtils from './serviceUtils';
import * as multipartServiceUtils from './multipartServiceUtils';

export const utils: typeof serviceUtils = serviceUtils;
export const multipartUtils: typeof multipartServiceUtils = multipartServiceUtils;

export type {
	RequestServiceResult,
	PartsGenerator,
	MultiPartFetchResult,
	BodyResult,
} from './multipartServiceUtils';
