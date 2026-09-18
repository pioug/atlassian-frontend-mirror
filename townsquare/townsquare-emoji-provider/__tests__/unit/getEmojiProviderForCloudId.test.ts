const mockEmojiResource: jest.Mock = jest.fn().mockImplementation(() => ({
	getEmojiProvider: jest.fn().mockResolvedValue({ setSelectedTone: jest.fn() }),
}));

// The entry point imports the recommended `emoji-resource` module; the barrel still imports the
// deprecated `resource` shim. Both resolve to the same class, so both are backed by one mock.
jest.mock('@atlaskit/emoji/emoji-resource', () => ({
	__esModule: true,
	default: mockEmojiResource,
}));
jest.mock('@atlaskit/emoji/resource', () => ({
	EmojiResource: mockEmojiResource,
}));

type EntryPoint = typeof import('../../src/getEmojiProviderForCloudId');
type Barrel = typeof import('../../src/provider');

const STANDARD_PROVIDER = { url: '/gateway/api/emoji/standard' };

describe('for-cloud-id entry point', () => {
	beforeEach(() => {
		mockEmojiResource.mockClear();
	});

	it('does not construct an EmojiResource when imported', () => {
		jest.isolateModules(() => {
			require('../../src/getEmojiProviderForCloudId');
		});

		expect(mockEmojiResource).not.toHaveBeenCalled();
	});

	it('constructs a site-aware, read-only resource on first call and caches it', async () => {
		let entryPoint: EntryPoint | undefined;
		jest.isolateModules(() => {
			entryPoint = require('../../src/getEmojiProviderForCloudId');
		});
		const { getEmojiProviderForCloudId } = entryPoint!;

		await getEmojiProviderForCloudId('cloud-a', 'user-1', true);
		await getEmojiProviderForCloudId('cloud-a', 'user-1', true);

		expect(mockEmojiResource).toHaveBeenCalledTimes(1);
		expect(mockEmojiResource).toHaveBeenCalledWith({
			providers: [
				STANDARD_PROVIDER,
				{ url: '/gateway/api/emoji/atlassian' },
				{ url: '/gateway/api/emoji/cloud-a/site' },
			],
			allowUpload: false,
			currentUser: { id: 'user-1' },
		});

		await getEmojiProviderForCloudId('cloud-b', 'user-1', true);
		expect(mockEmojiResource).toHaveBeenCalledTimes(2);
	});

	it('shares its resource cache with the barrel export', async () => {
		let entryPoint: EntryPoint | undefined;
		let barrel: Barrel | undefined;
		jest.isolateModules(() => {
			entryPoint = require('../../src/getEmojiProviderForCloudId');
			barrel = require('../../src/provider');
		});

		// Importing the barrel eagerly constructs the standard-set resource; that is the behaviour
		// the dedicated entry point exists to avoid.
		expect(mockEmojiResource).toHaveBeenCalledTimes(1);
		expect(mockEmojiResource).toHaveBeenCalledWith({ providers: [STANDARD_PROVIDER] });

		await entryPoint!.getEmojiProviderForCloudId('cloud-a', 'user-1', true);
		expect(mockEmojiResource).toHaveBeenCalledTimes(2);

		// A half-migrated consumer asking the barrel for the same key reuses the resource.
		await barrel!.getEmojiProviderForCloudId('cloud-a', 'user-1', true);
		expect(mockEmojiResource).toHaveBeenCalledTimes(2);
	});
});
