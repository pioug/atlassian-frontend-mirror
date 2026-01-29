import { create, type ReactTestRenderer, type ReactTestInstance } from 'react-test-renderer';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReactSerializer } from '../../../index';
import { emojiList } from './__fixtures__/emoji';
import Emoji, { EmojiItemComponent } from '../../../react/nodes/emoji';
import { type EmojiId } from '@atlaskit/emoji';

describe('Renderer - ReactSerializer - Emoji', () => {
	let docFromSchema: PMNode;
	let reactRenderer: ReactTestRenderer;

	beforeAll(() => {
		// Working around an issue with pre existing tests using react-test-renderer
		// https://github.com/facebook/react/issues/17301#issuecomment-557765213
		EmojiItemComponent.defaultProps = {};
	});

	describe('when emojiResourceConfig is null', () => {
		beforeAll(() => {
			const reactSerializer = new ReactSerializer({});
			docFromSchema = schema.nodeFromJSON(emojiList);
			reactRenderer = create(reactSerializer.serializeFragment(docFromSchema.content) as any);
		});

		it('renders an emoji', () => {
			const testInstance = reactRenderer.root;
			const components = testInstance.findAllByType(Emoji);
			expect(components).toHaveLength(3);
			components.forEach(({ props }) => {
				expect(props.emojiResourceConfig).toBeUndefined();
			});
		});
	});
	describe('when emojiResourceConfig is defined', () => {
		beforeAll(() => {
			const reactSerializer = new ReactSerializer({
				emojiResourceConfig: {
					providers: [],
					singleEmojiApi: {
						getUrl: (emojiId: EmojiId) => `emoji-path/${emojiId.id}`,
					},
				},
			});
			docFromSchema = schema.nodeFromJSON(emojiList);
			reactRenderer = create(reactSerializer.serializeFragment(docFromSchema.content) as any);
		});
		it('renders an optimistic emoji when optimisticImageApi is defined', () => {
			const testInstance = reactRenderer.root;
			const components = testInstance.findAllByType(Emoji);
			expect(components).toHaveLength(3);
			components.forEach(({ props, children }) => {
				const emojiComponent = children[0] as ReactTestInstance;
				expect(emojiComponent.props['resourceConfig']).not.toBeUndefined();
				expect(
					emojiComponent.props['resourceConfig'].singleEmojiApi.getUrl({
						id: props['id'],
						shortName: props['shortName'],
					}),
				).toEqual(`emoji-path/${props['id']}`);
			});
		});
	});
});
