import { getCloudId } from '../constants';

import { getConfluencePageAri } from './ari';

// Uncomment for proxy in Atlaskit, which will route to hello.atlassian.net
// const BASE_URL = 'https://localhost:9876';
const BASE_URL = `/gateway/api/ex/confluence/${getCloudId()}`;
const API_BASE_URL = `${BASE_URL}/wiki/api/v2`;

const COMMON_HEADERS = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

export type ContentProperty = {
	id: string;
	key: string;
	value: string;
	version: ContentPropertyVersion;
};

type ContentPropertyVersion = {
	authorId: string;
	createdAt: string;
	message: string;
	minorEdit: boolean;
	number: number;
};

type GetContentPropertiesUrlOptions = {
	contentPropertyId?: string;
	pageId: string;
};

const getContentPropertiesUrl = ({
	pageId,
	contentPropertyId,
}: GetContentPropertiesUrlOptions): string => {
	const url = `${API_BASE_URL}/pages/${pageId}/properties`;

	if (contentPropertyId) {
		return `${url}/${contentPropertyId}`;
	}
	return url;
};

const getGraphQLPropertiesUrl = (): string => {
	return `/cgraphql/api/graphql`;
};

type CreateContentPropertyOptions = {
	key: string;
	pageId: string;
	value: string;
};

export const createContentProperty = async ({
	pageId,
	key,
	value,
}: CreateContentPropertyOptions) => {
	const url = getContentPropertiesUrl({ pageId });

	const body = JSON.stringify({
		key,
		value,
	});

	const response = await fetch(url, {
		method: 'POST',
		headers: COMMON_HEADERS,
		body,
	});

	if (!response.ok) {
		throw new Error(`Failed to create content property: ${response.statusText}`);
	}

	const contentProperty = (await response.json()) as ContentProperty;

	return contentProperty;
};

type GetContentPropertyOptions = {
	contentPropertyId: string;
	pageId: string;
	signal?: AbortSignal;
};

export const getContentProperty = async ({
	pageId,
	contentPropertyId,
	signal,
}: GetContentPropertyOptions): Promise<ContentProperty> => {
	const url = getContentPropertiesUrl({ pageId, contentPropertyId });

	const response = await fetch(url, {
		method: 'GET',
		headers: COMMON_HEADERS,
		signal,
	});

	if (!response.ok) {
		throw new Error(`Failed to get content property: ${response.statusText}`);
	}

	const contentProperty = (await response.json()) as ContentProperty;

	return contentProperty;
};

type UpdateContentPropertyOptions = {
	key: string;
	pageId: string;
	signal?: AbortSignal;
	value: string;
};

const getQuery = (documentARI: string, key: string, value: string) => {
	return `mutation {
	  confluence {
	    updateValuePageProperty(input: {
	      pageId: "${documentARI}",
	      key: "${key}",
	      value: "${value}",
	      useSameVersion: true
	    }) {
	      pageProperty {
	        key,
	        value
	      }
	    }
	  }
	}`;
};

export const updateContentProperty = async ({
	pageId,
	key,
	value,
}: UpdateContentPropertyOptions): Promise<ContentProperty> => {
	const url = getGraphQLPropertiesUrl();

	const documentARI = getConfluencePageAri(pageId);

	// eslint-disable-next-line require-unicode-regexp
	const query = getQuery(documentARI, key, value.replace(/"/g, '\\"'));

	const bodyData = {
		query,
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: COMMON_HEADERS,
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to update content property: ${response.statusText}`);
	}

	const contentProperty = (await response.json()) as ContentProperty;

	return contentProperty;
};
