import { loadEmbeddedConfluencePage } from '../../loadEmbeddedConfluencePage';

const mockPage = jest.fn(() => null);
const mockLoadPage = jest.fn();

jest.mock('@atlaskit/embedded-confluence/page', () => {
	mockLoadPage();
	return { Page: mockPage };
});

it('loads the direct Page entry lazily and preserves component identity', async () => {
	expect(mockLoadPage).not.toHaveBeenCalled();

	await expect(loadEmbeddedConfluencePage()).resolves.toBe(mockPage);
	await expect(loadEmbeddedConfluencePage()).resolves.toBe(mockPage);

	expect(mockLoadPage).toHaveBeenCalledTimes(1);
});
