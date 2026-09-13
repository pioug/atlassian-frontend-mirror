import fetch from 'node-fetch';

const STATLAS_BASE_URL = 'https://statlas.prod.atl-paas.net/af-product-analytics';

export type Meta = {
	lastRunHash: string;
};

export async function getMeta(product: string): Promise<Meta | null> {
	const response = await retrieveJSON(getProductMetaPath(product));
	return response.json as Meta | null;
}

export function uploadMeta(product: string, lastRunHash: string): Promise<void> {
	return uploadJSON(getProductMetaPath(product), {
		lastRunHash,
	});
}

function getProductMetaPath(product: string) {
	return `product/${product}.json`;
}

async function retrieveJSON(filepath: string) {
	const response = await fetch(`${STATLAS_BASE_URL}/${filepath}?statlasredirect`);
	let json: Object | null = null;
	if (response.ok) {
		json = await response.json();
	}
	return { json, rawResponse: response };
}

async function uploadJSON(filepath: string, json: Object) {
	const res = await fetch(`${STATLAS_BASE_URL}/${filepath}`, {
		method: 'PUT',
		body: JSON.stringify(json),
		headers: {
			Authorization: `Bearer ${process.env.bamboo_JWT_TOKEN}`,
		},
	});
	if (!res.ok) {
		throw new Error(`Statlas upload failed: ${res.statusText}`);
	}
}
