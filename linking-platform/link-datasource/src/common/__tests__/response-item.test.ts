import { getResourceUrl } from '../utils/response-item';

describe('getResourceUrl', () => {
	it('returns url from key', () => {
		const data = {
			id: { data: 'some-id' },
			key: { data: { url: 'some-url' } },
		};
		const url = getResourceUrl(data);
		expect(url).toEqual('some-url');
	});

	it('returns url from title', () => {
		const data = {
			title: { data: { url: 'some-url' } },
			id: { data: 'some-id' },
		};
		const url = getResourceUrl(data);
		expect(url).toEqual('some-url');
	});

	it('returns url from key if both key and title are present', () => {
		const data = {
			id: { data: 'some-id' },
			key: { data: { url: 'some-key-url' } },
			title: { data: { url: 'some-title-url' } },
		};
		const url = getResourceUrl(data);
		expect(url).toEqual('some-key-url');
	});

	it('returns undefined if neither key nor title are present', () => {
		const data = {
			id: { data: 'some-id' },
		};
		const url = getResourceUrl(data);
		expect(url).toBeUndefined();
	});

	it('returns undefined if key does not contains url', () => {
		const data = {
			key: { data: {} },
			id: { data: 'some-id' },
		};
		const url = getResourceUrl(data);
		expect(url).toBeUndefined();
	});

	it('returns undefined if title does not contains url', () => {
		const data = {
			title: { data: {} },
			id: { data: 'some-id' },
		};
		const url = getResourceUrl(data);
		expect(url).toBeUndefined();
	});

	it('returns url from title if key does not contain url', () => {
		const data = {
			id: { data: 'some-id' },
			key: { data: {} },
			title: { data: { url: 'some-title-url' } },
		};
		const url = getResourceUrl(data);
		expect(url).toEqual('some-title-url');
	});
});
