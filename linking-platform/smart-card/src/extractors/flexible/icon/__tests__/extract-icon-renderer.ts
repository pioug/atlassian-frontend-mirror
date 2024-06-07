import {
	TEST_BASE_DATA,
	TEST_DATA_WITH_EMOJI,
	TEST_DATA_WITH_NO_PREFIX,
	TEST_EMOJI_SANITIZED,
} from '../../../common/__mocks__/jsonld';
import extractIconRenderer from '../extract-icon-renderer';

describe('extractIconRenderer', () => {
	it('returns a render function that returns emoji component', () => {
		const render = extractIconRenderer(TEST_DATA_WITH_EMOJI, {
			emoji: (emojiId) => emojiId,
		});
		// @ts-ignore Expect render to always be defined
		const emoji = render();
		expect(emoji).toBe(TEST_EMOJI_SANITIZED);
	});

	it('returns undefined if there is no prefix', () => {
		expect(extractIconRenderer(TEST_DATA_WITH_NO_PREFIX)).toBeUndefined();
	});

	it('returns undefined if prefix type is not emoji', () => {
		const render = extractIconRenderer({
			...TEST_BASE_DATA,
			'atlassian:titlePrefix': {
				'@type': 'Object',
				text: 'emoji',
			},
		});
		expect(render).toBeUndefined();
	});

	it('returns undefined if emoji id is not provided', () => {
		const render = extractIconRenderer(
			{
				...TEST_BASE_DATA,
				'atlassian:titlePrefix': {
					'@type': 'atlassian:Emoji',
					text: '',
				},
			},
			{ emoji: jest.fn() },
		);
		expect(render).toBeUndefined();
	});

	it('returns undefined if emoji renderer is not provided', () => {
		const render = extractIconRenderer(
			{
				...TEST_BASE_DATA,
				'atlassian:titlePrefix': {
					'@type': 'atlassian:Emoji',
					text: 'emoji',
				},
			},
			{ emoji: undefined },
		);
		expect(render).toBeUndefined();
	});
});
