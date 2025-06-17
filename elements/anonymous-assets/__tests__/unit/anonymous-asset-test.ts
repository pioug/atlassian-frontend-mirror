import { ANONYMOUS_ASSETS } from '../../src/common/utils/anonymous-assets';
import {
	addStyling,
	encodeSvgToDataUri,
	getAllAnonymousAssets,
	getAnonymousAsset,
	getAnonymousAvatarWithStyling,
	getAssetIndex,
	objectToStyleString,
	svgStringToDomDocument,
} from '../../src/common/utils/get-anonymous-asset';
import { fetchWithRetry } from '../../src/common/utils/retry';

jest.mock('../../src/common/utils/retry');
jest.mock('react-intl-next', () => ({
	...jest.requireActual('react-intl-next'),
	createIntl: () => ({
		formatMessage: (descriptor: any) => descriptor.defaultMessage,
	}),
}));

const ZERO_IDX = 0;
const idxZeroAsset = ANONYMOUS_ASSETS[ZERO_IDX];

const dataUrlMatcher = {
	protocol: 'data:',
	pathname: expect.stringMatching(/^image\/svg\+xml;base64,.+$/),
	host: '',
	hash: '',
	search: '',
	username: '',
	port: '',
} satisfies Partial<URL>;

const extractRelevantFieldsFromUrl = (url: URL) =>
	Object.fromEntries(
		Object.keys(dataUrlMatcher).map((key) => [key, url[key as keyof URL]] as const),
	);

const assetsLength = ANONYMOUS_ASSETS.length;
const indicesUpToLength = Array.from({ length: assetsLength }, (_, i) => i);

afterEach(() => {
	jest.resetAllMocks();
});

describe('objectToStyleString', () => {
	test('with 1 values', async () => {
		const css = {
			'background-color': 'blue',
		};
		const result = objectToStyleString(css);
		expect(result).toEqual('background-color: blue; ');
	});

	test('with multiple values', async () => {
		const css = {
			'background-color': 'blue',
			color: 'white',
		};
		const result = objectToStyleString(css);
		expect(result).toEqual('background-color: blue; color: white; ');
	});
});

describe(getAssetIndex, () => {
	it.each(indicesUpToLength)(
		'idx: %s - uses a modulo between the length of assets and its index',
		(clientId) => {
			expect(getAssetIndex(clientId)).toEqual(clientId);
		},
	);

	it('overflows the index', () => {
		expect(getAssetIndex(assetsLength)).toEqual(0);
		expect(getAssetIndex(assetsLength + 1)).toEqual(1);
	});
});

describe(getAnonymousAsset, () => {
	it.each(indicesUpToLength)('returns the name of the asset for index %s', async (index) => {
		const assets = await getAllAnonymousAssets();
		const { name: expectedName } = assets[getAssetIndex(index)];
		const { name } = await getAnonymousAsset({ index: index });
		expect(name).toEqual(expectedName);
	});

	it('returns the name of the asset when overflowing index', async () => {
		const index = assetsLength + 1;
		const assets = await getAllAnonymousAssets();

		const { name: expectedName } = assets[getAssetIndex(index)];
		const { name } = await getAnonymousAsset({ index: index });
		expect(name).toEqual(expectedName);
	});
});

describe(svgStringToDomDocument, () => {
	it('returns a document with an svg in it', () => {
		const svgString = '<svg/>';
		const doc = svgStringToDomDocument(svgString);

		expect(doc.documentElement.outerHTML).toEqual('<svg/>');
	});
});

describe(addStyling, () => {
	it('prefixes the svg with data:image/svg+xml', () => {
		const expectedBackgroundColor = '#421337';

		const sampleSvg = svgStringToDomDocument(idxZeroAsset.src);

		addStyling(sampleSvg.documentElement, { 'background-color': expectedBackgroundColor });

		expect(sampleSvg.documentElement.getAttribute('style')).toEqual(
			`background-color: ${expectedBackgroundColor};`,
		);
	});
});

describe(encodeSvgToDataUri, () => {
	it('converts an SVG to a data URI', () => {
		const svg = document.createElement('svg');
		expect(extractRelevantFieldsFromUrl(new URL(encodeSvgToDataUri(svg)))).toEqual(dataUrlMatcher);
	});
});

describe(getAnonymousAvatarWithStyling, () => {
	beforeEach(() => {
		(fetchWithRetry as jest.Mock).mockResolvedValue({
			success: true,
			result: {
				text: () => Promise.resolve(idxZeroAsset.src),
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns svg in the form of a data URI', async () => {
		const mockOnError = jest.fn();
		const asset = await getAnonymousAvatarWithStyling({
			index: ZERO_IDX,
			styleProperties: {},
			onError: mockOnError,
		});

		if (asset?.src === undefined) {
			throw Error(
				"In this case, the SVG should always be defined since we're supposed to be mocking the fetch response of the SVG as a successful response",
			);
		}
		const dataUrl = new URL(asset.src);

		expect(extractRelevantFieldsFromUrl(dataUrl)).toEqual(dataUrlMatcher);
		expect(mockOnError).not.toHaveBeenCalled();
	});

	it('correct error handling', async () => {
		const expectedError = new Error('some error');
		(fetchWithRetry as jest.Mock).mockResolvedValue({
			success: false,
			error: expectedError,
		});

		const mockOnError = jest.fn();
		const asset = await getAnonymousAvatarWithStyling({
			index: ZERO_IDX,
			styleProperties: {},
			onError: mockOnError,
		});

		expect(mockOnError).toHaveBeenCalledWith(expectedError);
		expect(asset).toBeUndefined();
	});

	it('empty response calls on error', async () => {
		(fetchWithRetry as jest.Mock).mockResolvedValue({
			success: true,
			result: {
				text: () => Promise.resolve(''),
			},
		});

		const mockOnError = jest.fn();
		const asset = await getAnonymousAvatarWithStyling({
			index: ZERO_IDX,
			styleProperties: {},
			onError: mockOnError,
		});

		const { id, src } = await getAnonymousAsset({ index: ZERO_IDX });
		expect(mockOnError).toHaveBeenCalledWith(
			new Error(`svg returned null with svg ${id} with src ${src}`),
		);
		expect(asset).toBeUndefined();
	});
});
