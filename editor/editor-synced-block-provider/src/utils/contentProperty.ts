import { getConfluencePageAri } from './ari';

const COMMON_HEADERS = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

const AGG_HEADERS = {
	'X-ExperimentalApi': 'confluence-agg-beta',
};

const GRAPHQL_ENDPOINT = '/gateway/api/graphql';

const GET_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_GET';
const CREATE_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_CREATE';
const UPDATE_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_UPDATE';

type GetContentPropertyOptions = {
	cloudId: string;
	key: string;
	pageId: string;
	signal?: AbortSignal;
};

type CreateContentPropertyOptions = {
	cloudId: string;
	key: string;
	pageId: string;
	value: string;
};

type UpdateContentPropertyOptions = {
	cloudId: string;
	key: string;
	pageId: string;
	signal?: AbortSignal;
	value: string;
};

export type GetContentPropertyResult = {
	data: {
		confluence: {
			page: {
				properties:
					| [
							{
								key: string | null;
								value: string | null;
							},
					  ]
					| null;
			};
		};
	};
};

export type UpdateContentPropertyResult = {
	data: {
		confluence: {
			updateValuePageProperty: {
				pageProperty: {
					key: string | null;
					value: string | null;
				} | null;
			};
		};
	};
};

export type CreateContentPropertyResult = {
	data: {
		confluence: {
			createPageProperty: {
				pageProperty: {
					key: string | null;
					value: string | null;
				} | null;
			};
		};
	};
};

/**
 * Query to get the page property by key
 * @param documentARI
 * @param key
 * @returns
 */
const GET_QUERY = `query ${GET_OPERATION_NAME} ($id: ID!, $keys: [String]!) {
					confluence {
						page (id: $id) {
							properties(keys: $keys) {
								key,
								value
							}
						}
					}
				}`;

/**
 * Query to create a page property with key and value
 * @param documentARI
 * @param key
 * @param value
 * @returns
 */
const CREATE_QUERY = `mutation ${CREATE_OPERATION_NAME} ($input: ConfluenceCreatePagePropertyInput!){
						confluence {
							createPageProperty(input: $input) {
								pageProperty {
									key,
									value
								}
							}
						}
					}`;

/**
 * Query to update a page property with key and value without bumping the version
 * @param documentARI
 * @param key
 * @param value
 * @returns
 */
const UPDATE_QUERY = `mutation ${UPDATE_OPERATION_NAME} ($input: ConfluenceUpdateValuePagePropertyInput!) {
						confluence {
							updateValuePageProperty(input: $input) {
								pageProperty {
									key,
									value
								}
							}
						}
					}`;

export const getContentProperty = async ({
	pageId,
	key,
	cloudId,
}: GetContentPropertyOptions): Promise<GetContentPropertyResult> => {
	const documentARI = getConfluencePageAri(pageId, cloudId);

	const bodyData = {
		query: GET_QUERY,
		operationName: GET_OPERATION_NAME,
		variables: {
			id: documentARI,
			keys: [key],
		},
	};

	const response = await fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to get content property: ${response.statusText}`);
	}

	const contentProperty = (await response.json()) as GetContentPropertyResult;

	return contentProperty;
};

export const updateContentProperty = async ({
	pageId,
	key,
	value,
	cloudId,
}: UpdateContentPropertyOptions): Promise<UpdateContentPropertyResult> => {
	const documentARI = getConfluencePageAri(pageId, cloudId);
	const bodyData = {
		query: UPDATE_QUERY,
		operationName: UPDATE_OPERATION_NAME,
		variables: {
			input: {
				pageId: documentARI,
				key,
				value,
				useSameVersion: true,
			},
		},
	};

	const response = await fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to update content property: ${response.statusText}`);
	}

	const contentProperty = (await response.json()) as UpdateContentPropertyResult;

	return contentProperty;
};

export const createContentProperty = async ({
	pageId,
	key,
	value,
	cloudId,
}: CreateContentPropertyOptions) => {
	const documentARI = getConfluencePageAri(pageId, cloudId);

	// eslint-disable-next-line require-unicode-regexp
	const escapedValue = value.replace(/"/g, '\\"');

	const bodyData = {
		query: CREATE_QUERY,
		operationName: CREATE_OPERATION_NAME,
		variables: {
			input: {
				pageId: documentARI,
				key,
				value: escapedValue,
			},
		},
	};

	const response = await fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to create content property: ${response.statusText}`);
	}

	const contentProperty = (await response.json()) as CreateContentPropertyResult;

	return contentProperty;
};
