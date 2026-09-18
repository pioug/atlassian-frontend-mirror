import { createElement, Fragment } from 'react';

import Loadable from 'react-loadable';

import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EmojiId } from '@atlaskit/emoji';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';

import { ReactSerializer } from '../../../index';
import Emoji from '../../../react/nodes/emoji';
import { emojiList } from './__fixtures__/emoji';

// The emoji node needs an emoji provider to render anything, so it is stubbed out and only the
// props the serializer hands to it are asserted.
jest.mock('../../../react/nodes/emoji', () => {
	const actual = jest.requireActual('../../../react/nodes/emoji');

	return {
		...actual,
		__esModule: true,
		default: jest.fn(() => null),
	};
});

const emojiMock = Emoji as unknown as jest.Mock;

const renderEmojiList = (init: ConstructorParameters<typeof ReactSerializer>[0]) => {
	const reactSerializer = new ReactSerializer(init);
	const docFromSchema: PMNode = schema.nodeFromJSON(emojiList);

	render(createElement(Fragment, null, reactSerializer.serializeFragment(docFromSchema.content)));
};

describe('Renderer - ReactSerializer - Emoji', () => {
	beforeAll(async () => {
		// The emoji node is code split, so it renders nothing until the chunk resolves
		await Loadable.preloadAll();
	});

	beforeEach(() => {
		emojiMock.mockClear();
	});

	describe('when emojiResourceConfig is null', () => {
		it('renders an emoji', () => {
			renderEmojiList({});

			expect(emojiMock).toHaveBeenCalledTimes(3);
			emojiMock.mock.calls.forEach(([props]) => {
				expect(props.resourceConfig).toBeUndefined();
			});
		});
	});

	describe('when emojiResourceConfig is defined', () => {
		it('renders an optimistic emoji when optimisticImageApi is defined', () => {
			renderEmojiList({
				emojiResourceConfig: {
					providers: [],
					singleEmojiApi: {
						getUrl: (emojiId: EmojiId) => `emoji-path/${emojiId.id}`,
					},
				},
			});

			expect(emojiMock).toHaveBeenCalledTimes(3);
			emojiMock.mock.calls.forEach(([props]) => {
				expect(props.resourceConfig).not.toBeUndefined();
				expect(
					props.resourceConfig.singleEmojiApi.getUrl({
						id: props.id,
						shortName: props.shortName,
					}),
				).toEqual(`emoji-path/${props.id}`);
			});
		});
	});

	describe('when emojiProviderLookupOrder is defined', () => {
		it('passes emojiProviderLookupOrder to emoji nodes', () => {
			passGate('platform_bitbucket_fix_shortname_and_ordering');

			renderEmojiList({
				emojiProviderLookupOrder: ['STANDARD', 'ATLASSIAN'],
			});

			expect(emojiMock).toHaveBeenCalledTimes(3);
			emojiMock.mock.calls.forEach(([props]) => {
				expect(props.emojiProviderLookupOrder).toEqual(['STANDARD', 'ATLASSIAN']);
			});
		});
	});
});
