import { ROVO_PARAM_PREFIX, ROVO_VALID_PARAMS } from './constants';
import { type BaseRovoChatParams, type RovoChatParams, type ValidParam } from './types';

export const firstCharUpper = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const firstCharLower = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

const isValidURL = (url: string): boolean => {
	try {
		new URL(url);
		return true;
	} catch (error) {
		return false;
	}
};

// For new style camelCase params
export const addPrefix = (param: ValidParam): string =>
	`${ROVO_PARAM_PREFIX}${firstCharUpper(param)}`;

export const removePrefix = (param: string): string => {
	return firstCharLower(param.replace(ROVO_PARAM_PREFIX, ''));
};

// Creates RovoChatParams from URLSearchParams
// Optionally filter to specific params
const processParams = (
	input: URLSearchParams | string,
	options: {
		filter?: Array<ValidParam>;
	} = { filter: [] },
): {
	processed: URLSearchParams;
	rovoParams: Partial<BaseRovoChatParams>;
	combinedQueryString: string;
} => {
	const output: { [key: string]: any } = {};
	const safeSearchParamsInput =
		typeof input === 'string'
			? isValidURL(input)
				? new URLSearchParams(new URL(input).search)
				: new URLSearchParams(input)
			: input;
	const processedInput = new URLSearchParams(safeSearchParamsInput);
	const extracted = new URLSearchParams();

	safeSearchParamsInput.forEach((value, key) => {
		// Only look at rovoChat params
		if (!key.startsWith(ROVO_PARAM_PREFIX)) {
			return;
		}

		const paramKey = removePrefix(key) as ValidParam;

		if (options?.filter?.length) {
			if (options.filter.includes(paramKey)) {
				output[paramKey] = decodeURIComponent(value);
				extracted.append(key, value);
			}
		} else {
			output[paramKey] = decodeURIComponent(value);
		}

		// Remove rovoParam from processed input
		processedInput.delete(key);
	});

	const combinedQueryString = [processedInput, extracted]
		.map((params) => params.toString())
		.filter((part) => part.length > 0)
		.join('&');

	return {
		processed: processedInput,
		rovoParams: output,
		combinedQueryString,
	};
};

// Get all rovoChat params from a URL or the current window location if undefined
export const getRovoParams = (url?: string): RovoChatParams => {
	try {
		const search = url ? new URL(url).search : window.location.search;
		const q = new URLSearchParams(search);
		return processParams(q).rovoParams;
	} catch (error) {
		return {};
	}
};

// Update the address bar without reloading the page
export const updatePageRovoParams = (params: RovoChatParams) => {
	window.history.pushState({}, '', addRovoParamsToUrl(window.location.pathname, params));
};

// Add any valid rovoChat params to a URL
export const addRovoParamsToUrl = (url: string, params: RovoChatParams): string => {
	const { processed, rovoParams } = processParams(url);
	const rovoParamsWithExisting = { ...rovoParams, ...params };

	const baseUrl = url.includes('?') ? url.split('?')[0] : url;
	const baseQuery = Array.from(processed).length ? `?${processed.toString()}&` : '?';

	const updatedRovoParamsString = encodeRovoParams(rovoParamsWithExisting);

	return `${baseUrl}${baseQuery}${updatedRovoParamsString}`;
};

export const encodeRovoParams = (
	params: RovoChatParams,
	encodeAsObject?: boolean,
): string | { [key: string]: string } => {
	if (encodeAsObject) {
		return Object.entries(params).reduce(
			(acc, [key, value]) => {
				acc[addPrefix(key as ValidParam)] = encodeURIComponent(value);

				return acc;
			},
			{} as { [key: string]: string },
		);
	}

	return Object.entries(params)
		.map(([key, value]) => {
			return `${addPrefix(key as ValidParam)}=${encodeURIComponent(value)}`;
		})
		.join('&');
};

export const assertOnlySpecificFieldsDefined = (
	params: RovoChatParams,
	fields: (keyof RovoChatParams)[],
): boolean => {
	return Object.entries(params).every(([key, value]) => {
		const field = fields.find((field) => field === key);

		if (field) {
			return value !== undefined;
		} else {
			return value === undefined;
		}
	});
};

export const getListOfRovoParams = ({ resourceRouterQuery = false } = {}): string[] => {
	/*
	For products using react-resource-router (e.g Atlas) to
	pass as the value of `query` on the route definition. It ensures that our parameters
	are not stripped from the URL when loading the page, or through redirect hops
	Any new parameters we want to maintain should be added here as well, which means
	only a version bump is needed in those products to support the latest param list
	The !=false simply means that the parameter is supported but is optional, and should
	not contain a value of 'false'
	*/
	const suffix = resourceRouterQuery ? '!=false' : '';

	return ROVO_VALID_PARAMS.map((param) => `${addPrefix(param)}${suffix}`);
};
