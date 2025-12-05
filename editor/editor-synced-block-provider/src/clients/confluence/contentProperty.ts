import type { SyncBlockData } from '../../common/types';
import { fetchWithRetry } from '../../utils/retry';

import { getConfluencePageAri, type PAGE_TYPE } from './ari';
import { isBlogPageType } from './utils';

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
const DELETE_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_DELETE';

type GetContentPropertyOptions = {
	cloudId: string;
	key: string;
	pageId: string;
	pageType: PAGE_TYPE;
	signal?: AbortSignal;
};

type CreateContentPropertyOptions = {
	cloudId: string;
	key: string;
	pageId: string;
	pageType: PAGE_TYPE;
	value: SyncBlockData;
};

type UpdateContentPropertyOptions = {
	cloudId: string;
	key: string;
	pageId: string;
	pageType: PAGE_TYPE;
	signal?: AbortSignal;
	value: SyncBlockData;
};

type DeleteContentPropertyOptions = {
	cloudId: string;
	key: string;
	pageId: string;
	pageType: PAGE_TYPE;
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

export type GetBlogPostContentPropertyResult = {
	data: {
		confluence: {
			blogPost: {
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

export type UpdateBlogPostContentPropertyResult = {
	data: {
		confluence: {
			updateValueBlogPostProperty: {
				blogPostProperty: {
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

export type CreateBlogPostContentPropertyResult = {
	data: {
		confluence: {
			createBlogPostProperty: {
				blogPostProperty: {
					key: string | null;
					value: string | null;
				} | null;
			};
		};
	};
};

export type DeletePageContentPropertyResult = {
	data: {
		confluence: {
			deletePageProperty: {
				errors: [
					{
						message: string;
					},
				];
				success: boolean;
			};
		};
	};
};

export type DeleteBlogPostPropertyResult = {
	data: {
		confluence: {
			deleteBlogPostProperty: {
				errors: [
					{
						message: string;
					},
				];
				success: boolean;
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
const GET_PAGE_QUERY = `query ${GET_OPERATION_NAME} ($id: ID!, $keys: [String]!) {
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
 * Query to get the blog page property by key
 * @param documentARI
 * @param key
 * @returns
 */
const GET_BLOG_QUERY = `query ${GET_OPERATION_NAME} ($id: ID!, $keys: [String]!) {
	confluence {
		blogPost (id: $id) {
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
const CREATE_PAGE_QUERY = `mutation ${CREATE_OPERATION_NAME} ($input: ConfluenceCreatePagePropertyInput!){
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
 * Query to create a blog page property with key and value
 * @param documentARI
 * @param key
 * @param value
 * @returns
 */
const CREATE_BLOG_QUERY = `mutation ${CREATE_OPERATION_NAME} ($input: ConfluenceCreateBlogPostPropertyInput!){
	confluence {
		createBlogPostProperty(input: $input) {
			blogPostProperty {
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
const UPDATE_PAGE_QUERY = `mutation ${UPDATE_OPERATION_NAME} ($input: ConfluenceUpdateValuePagePropertyInput!) {
						confluence {
							updateValuePageProperty(input: $input) {
								pageProperty {
									key,
									value
								}
							}
						}
					}`;

/**
 * Query to update a blog page property with key and value without bumping the version
 * @param documentARI
 * @param key
 * @param value
 * @returns
 */
const UPDATE_BLOG_QUERY = `mutation ${UPDATE_OPERATION_NAME} ($input: ConfluenceUpdateValueBlogPostPropertyInput!) {
	confluence {
		updateValueBlogPostProperty(input: $input) {
			blogPostProperty {
				key,
				value
			}
		}
	}
}`;

const DELETE_PAGE_QUERY = `mutation ${DELETE_OPERATION_NAME} ($input: ConfluenceDeletePagePropertyInput!) {
						confluence {
							deletePageProperty(input: $input) {
								success, errors {
								  message
								}
							}
						}
					}`;

const DELETE_BLOG_QUERY = `mutation ${DELETE_OPERATION_NAME} ($input: ConfluenceDeleteBlogPostPropertyInput!) {
						confluence {
							deleteBlogPostProperty(input: $input) {
								success, errors {
								  message
								}
							}
						}
					}`;

export const getContentProperty = async <
	T extends GetContentPropertyResult | GetBlogPostContentPropertyResult,
>({
	pageId,
	key,
	cloudId,
	pageType,
}: GetContentPropertyOptions): Promise<T> => {
	const documentARI = getConfluencePageAri(pageId, cloudId, pageType);
	const isBlog = isBlogPageType(pageType);
	const bodyData = {
		query: isBlog ? GET_BLOG_QUERY : GET_PAGE_QUERY,
		operationName: GET_OPERATION_NAME,
		variables: {
			id: documentARI,
			keys: [key],
		},
	};

	const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to get content property: ${response.statusText}`);
	}

	return (await response.json()) as T;
};

export const updateContentProperty = async <
	T extends UpdateContentPropertyResult | UpdateBlogPostContentPropertyResult,
>({
	pageId,
	key,
	value,
	cloudId,
	pageType,
}: UpdateContentPropertyOptions): Promise<T> => {
	const documentARI = getConfluencePageAri(pageId, cloudId, pageType);
	const isBlog = isBlogPageType(pageType);

	const useSameVersion = { useSameVersion: true };

	let input = {
		...(isBlog ? { blogPostId: documentARI } : { pageId: documentARI }),
		key,
		value: JSON.stringify(value),
	};

	// Blog content properties don't support the useSameVersion flag at the moment
	if (!isBlog) {
		input = { ...input, ...useSameVersion };
	}

	const bodyData = {
		query: isBlog ? UPDATE_BLOG_QUERY : UPDATE_PAGE_QUERY,
		operationName: UPDATE_OPERATION_NAME,
		variables: {
			input,
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

	return (await response.json()) as T;
};

export const createContentProperty = async <
	T extends CreateContentPropertyResult | CreateBlogPostContentPropertyResult,
>({
	pageId,
	key,
	value,
	cloudId,
	pageType,
}: CreateContentPropertyOptions): Promise<T> => {
	const documentARI = getConfluencePageAri(pageId, cloudId, pageType);
	const isBlog = isBlogPageType(pageType);
	const bodyData = {
		query: isBlog ? CREATE_BLOG_QUERY : CREATE_PAGE_QUERY,
		operationName: CREATE_OPERATION_NAME,
		variables: {
			input: {
				...(isBlog ? { blogPostId: documentARI } : { pageId: documentARI }),
				key,
				value: JSON.stringify(value),
			},
		},
	};

	const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to create content property: ${response.statusText}`);
	}

	return (await response.json()) as T;
};

export const deleteContentProperty = async <
	T extends DeletePageContentPropertyResult | DeleteBlogPostPropertyResult,
>({
	pageId,
	cloudId,
	pageType,
	key,
}: DeleteContentPropertyOptions): Promise<T> => {
	const documentARI = getConfluencePageAri(pageId, cloudId, pageType);
	const isBlog = isBlogPageType(pageType);
	const bodyData = {
		query: isBlog ? DELETE_BLOG_QUERY : DELETE_PAGE_QUERY,
		operationName: DELETE_OPERATION_NAME,
		variables: {
			input: {
				...(isBlog ? { blogPostId: documentARI } : { pageId: documentARI }),
				key,
			},
		},
	};

	const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to delete content property: ${response.statusText}`);
	}

	return (await response.json()) as T;
};
