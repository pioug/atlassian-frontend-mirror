import fetchMock from 'fetch-mock/cjs/client';

fetchMock.config.fallbackToNetwork = true;

interface FetchMockRequestDetails {
	body: string;
	credentials: string;
	headers: object;
	method: string;
}

export const mockMediaFetchRequests = () => {
	const makeMockResponseItem = (id: string, collection: string) => ({
		type: 'file',
		id,
		collection,
		details: {
			mediaType: 'image',
			mimeType: 'image/png',
			name: 'test-image.png',
			size: 158,
			processingStatus: 'succeeded',
			artifacts: {
				'image.jpg': {
					url: '/file/5e82cf3e-6bc3-4d6d-8830-8e25ac5589de/artifact/image.jpg/binary',
					processingStatus: 'succeeded',
				},
				'image.png': {
					url: '/file/5e82cf3e-6bc3-4d6d-8830-8e25ac5589de/artifact/image.png/binary',
					processingStatus: 'succeeded',
				},
			},
			representations: {
				image: {},
			},
			createdAt: 1692768921463,
		},
	});

	// mock the media items API to prevent excess console logging in sandbox.
	// response payload has to contain the request id's hence the mapping.
	fetchMock.post(
		'https://media.dev.atl-paas.net/items',
		async (url: string, request: FetchMockRequestDetails) => {
			const requestPayload = JSON.parse(request.body);
			return new Promise((resolve) => {
				resolve({
					body: {
						data: {
							items:
								requestPayload?.descriptors.map((d: Record<string, string>) =>
									makeMockResponseItem(d.id, d.collection),
								) ?? [],
						},
					},
				});
			});
		},
	);
};
